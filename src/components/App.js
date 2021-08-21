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
		try {
			await this.loadWeb3()
			await this.loadBlockchainData()
		} catch (err) {
			console.log("err:", err)
			this.setState({error: true})
		}
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
		console.log("loading blockchain data")
		const web3 = window.web3
		const accounts = await web3.eth.getAccounts()
		console.log("accounts:", accounts)
		const networkId = await web3.eth.net.getId()
		const networkData = DappOverflow.networks[networkId]		
		this.setState({account: accounts[0]})

		console.log("networkData:", networkData)

		if (networkData) {

			const dappOverflow = web3.eth.Contract(DappOverflow.abi, networkData.address)
			this.setState({dappOverflow})
			await this.getPosts()

			// var filter = web3.eth.filter({
			// 	fromBlock:0,
			// 	toBlock: 'latest',
			// 	address: networkData.address,
			// 	'topics':[
			// 		web3.utils.sha3('PostCreated(uint,string,string,string,string,uint,uint,address)')
			// 	]
			// });
			// console.log("filter:", filter)
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
		}
	}

	createPost = (title, topic, question) => {
		ipfs.add(this.state.buffer, (error, result) => {
			if (error) {
				console.error(error)
				return
			}

			this.setState({loading: true})
			this.state.dappOverflow.methods.createPost(title, topic, result[0].hash, question).send({from: this.state.account}).on('transactionHash', async (hash) => {
				this.setState({loading: false})
				console.log("hash:", hash)
				await this.getPosts()
			})
		})
	}

	async getPosts() {
		const postCount = await this.state.dappOverflow.methods.postCount().call()
		console.log("postCount:", postCount.toString(2))
		this.setState({postCount})

		for (var i = 1; i <= 12; i++) {
			console.log("i:", i)
			const post = await this.state.dappOverflow.methods.posts(i).call()
			console.log("post:", post)
			this.setState({
				posts: [...this.state.posts, post]
			})
		}

		this.setState({
			posts: this.state.posts.sort((a, b) => b.tipAmount - a.tipAmount)
		})

		this.setState({loading: false})
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
			loading: true,
			error: false
		}
	}

	render() {
		return (
			<div className="main">
				<Navbar account={this.state.account} />
				{this.state.error 
					? <div id="error" className="error text-center mt-5"><p>There was an error connecting to the blockchain or account. Please refresh and try again.</p></div>
					: this.state.loading
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

// https://mycolor.space/?hex=%23845EC2&sub=1