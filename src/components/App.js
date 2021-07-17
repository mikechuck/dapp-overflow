import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import DappOverflow from '../abis/DappOverflow.json'
import Navbar from './Navbar/Navbar'
import Main from './Main/Main'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})

class App extends Component {

	async componentWillMount() {
		await this.loadWeb3()
		await this.loadBlockchainData()
	}

	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable()
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
		} else {
			window.alert("Non-Ethereum browser detected")
		}
	}

	async loadBlockchainData() {
		const web3 = window.web3
		const accounts = await web3.eth.getAccounts()
		this.setState({account: accounts[0]})

		const networkId = await web3.eth.net.getId()
		const networkData = DappOverflow.networks[networkId]
		if (networkData) {
			const dappOverflow = web3.eth.Contract(DappOverflow.abi, networkData.address)
			this.setState({dappOverflow})
			const postCount = await dappOverflow.methods.postCount().call()
			this.setState({postCount})

			for (var i = 1; i <= postCount; i++) {
				const post = await dappOverflow.methods.posts(i).call()
				this.setState({
					posts: [...this.state.posts, post]
				})
			}

			this.setState({
				posts: this.state.posts.sort((a, b) => b.tipAmount - a.tipAmount)
			})

			this.setState({loading: false})
		} else {
			window.alert("DappOVerflow contract has not been deployed to this network")
		}
	}

	captureFile = event => {
		event.preventDefault()
		const file = event.target.files[0]
		const reader = new window.FileReader()
		reader.readAsArrayBuffer(file)

		reader.onloadend = () => {
			this.setState({buffer: Buffer(reader.result)})
			console.log("buffer", this.state.buffer)
		}
	}

	createPost = (title, topic, question) => {
		ipfs.add(this.state.buffer, (error, result) => {
			console.log("Ipfs result:", result)
			if (error) {
				console.error(error)
				return
			}

			console.log("saving with image hash:", result[0].hash)

			this.setState({loading: true})
			this.state.dappOverflow.methods.createPost(title, topic, result[0].hash, question).send({from: this.state.account}).on('transactionHash', (hash) => {
				this.setState({loading: false})
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

	constructor(props) {
		super(props)
		this.state = {
			account: '',
			dappOverflow: null,
			posts: [],
			loading: true
		}
	}

	render() {
		console.log("this.state.posts:", this.state.posts)
		return (
			<div>
				<Navbar account={this.state.account} />
				{this.state.loading
					? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
					: <Main
						posts={this.state.posts}
						captureFile={this.captureFile}
						createPost={this.createPost}
						tipPostOwner={this.tipPostOwner}
					/>
				}
			</div>
		);
	}
}

export default App;