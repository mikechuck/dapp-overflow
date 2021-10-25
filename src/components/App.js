import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import DappOverflow from '../abis/DappOverflow.json'
import Navbar from './Navbar/Navbar'
import Main from './Main/Main'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})

class App extends Component {

	constructor(props) {
		super(props)
		this.state = {
			account: '',
			dappOverflow: null,
			posts: [],
			loading: true,
			error: false,
			postsPerPage: 5,
			pageNumber: 1,
			savingQuestion: false
		}
	}

	async componentWillMount() {
		try {
			await this.loadWeb3()
		} catch (err) {
			console.log("err:", err)
			this.setState({error: true})
		}
	}

	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable()
			await this.loadBlockchainData()
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
			await this.loadBlockchainData()
		} else {
			window.alert("Non-Ethereum browser detected")
		}
	}

	async loadBlockchainData() {
		const web3 = window.web3
		const accounts = await web3.eth.getAccounts()
		const networkId = await web3.eth.net.getId()
		const networkData = DappOverflow.networks[networkId]		
		this.setState({account: accounts[0]})

		if (networkData) {
			const dappOverflow = web3.eth.Contract(DappOverflow.abi, networkData.address)
			console.log("setting dappoverflow variable")
			this.setState({dappOverflow})
			// await this.getPosts()
			this.setState({loading: false})
		} else {
			window.alert("DappOVerflow contract has not been deployed to this network")
		}
	}

	captureFile = file => {
		const reader = new window.FileReader()
		reader.readAsArrayBuffer(file)

		reader.onloadend = () => {
			this.setState({
				buffer: Buffer(reader.result)
			})
		}
	}

	createPost = (title, topic, question) => {
		this.setState({loading: true})
		ipfs.add(this.state.buffer, (error, result) => {
			if (error) {
				console.error(error)
				return
			}
			this.state.dappOverflow.methods.createPost(title, topic, result[0].hash, question).send({from: this.state.account}).on('transactionHash', async (hash) => {
				this.setState({loading: false})
				console.log("hash:", hash)
				// await this.getPosts()
			})
		})
	}

	tipPostOwner = (id, tipAmount) => {
		console.log("tipping post owner")
		// this.setState({loading: true})
		// this.state.dappOverflow.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
		// 	this.setState({ loading: false })
		//   })
	}

	render() {
		return (
			<div className="main">
				<Navbar account={this.state.account} />
				{this.state.error 
					? <div id="error" className="error text-center mt-5"><p>There was an error connecting to the blockchain or account. Please refresh and try again.</p></div>
					: this.state.loading
						? <div id="loader" className="loading-container text-center mt-5"><p>Loading dApp...</p></div>
						: <Main
							posts={this.state.posts}
							captureFile={this.captureFile}
							createPost={this.createPost}
							tipPostOwner={this.tipPostOwner}
							dappOverflow={this.state.dappOverflow}
							savingQuestion={this.state.savingQuestion}
						/>
				}
			</div>
		);
	}
}

export default App;

// https://mycolor.space/?hex=%23845EC2&sub=1