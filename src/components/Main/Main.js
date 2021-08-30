import React, { Component } from 'react';
import Identicon from 'identicon.js';
import './Main.css';

class Main extends Component {
	constructor(props) {
		super(props)
		this.state = {
			posts: [],
			carouselClass: '',
			loadingPosts: true,
			loadingNextPage: false,
			loadingPreviousPage: false,
			pageNumber: 1,
			postsPerPage: 5
		}
		this.previousPage = this.previousPage.bind(this)
		this.nextPage = this.nextPage.bind(this)
	}

	async componentWillMount() {
		try {
			await this.getPosts()
		} catch (err) {
			console.log("err:", err)
			this.setState({error: true})
		}
	}

	async getPosts() {
		console.log("getting posts")
		const postCount = await this.props.dappOverflow.methods.postCount().call()
		this.setState({postCount})

		let startIndex = (this.state.pageNumber - 1) * this.state.postsPerPage
		let endIndex = this.state.pageNumber * this.state.postsPerPage

		let postsArray = []

		for (var i = startIndex; i < endIndex; i++) {
			// console.log("i:", i)
			const post = await this.props.dappOverflow.methods.posts(i).call()
			// console.log("post:", post)
			postsArray.push(post)
		}

		this.setState({
			posts: postsArray.sort((a, b) => b.tipAmount - a.tipAmount),
			loadingPosts: false
		})
	}

	previousPage() {
		this.setState({
			carouselClass: ''
		})
	}

	nextPage() {
		/*
		- create new element to the right with blank elemnts
		- move current view to the left using a transform
		- delete old element 
		- when done moving, start loading new content
		- when done loading, populate view
		*/
		this.setState({
			loadingNextPage: true,
			carouselClass: 'move-left'
		})
	}



	render() {
		return (
			<div className="main-container">
				<main role="main">
					<div className="form-container">
						<h2 className="form-title">Ask a Question</h2>
						<form onSubmit={(event) => {
							event.preventDefault()
							const question = this.postQuestion.value
							const title = this.postTitle.value
							const topic = this.postTopic.value
							this.props.createPost(title, topic, question)
						}}>
							<input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
							<div className="form-group mr-sm-2">
								<input className="title-input form-control" type="text" ref={(input) => { this.postTitle = input }} placeholder="Title" required />
								<select className="topic-select form-control" ref={(option) => { this.postTopic = option }}>
									<option className="topic-option" value="Solidity">Solidity</option>
								</select>
								<textarea id="postQuestion" type="text" ref={(input) => { this.postQuestion = input }} className="form-control" placeholder="What do you want to know?" required />
							</div>
							<button type="submit" className="btn btn-primary btn-block btn-lg submit-button">Submit</button>
						</form>
					</div>
					{/* <div className="divider"></div> */}

					<h4 className="questions-header">Questions</h4>
					<div className="bottom-section">
						<div className="pagination-left" onClick={this.previousPage}>
							<p>&#60;</p>
						</div>
						<div className={`carousel ${this.state.carouselClass}`}>
							{(this.state.loadingPosts) ?
								<div className={`question-card-list ${this.state.loadingQuestionClass}`}>
									{this.state.posts.map((post, key) => {
										return (
											<div className="card question-card" key={key} >
											</div>
										)
									})}
								</div>
								:
								<div className="question-card-list">
									{this.state.posts.map((post, key) => {
										return (
											<div className="card question-card" key={key} >
												<div className="content">
													<div className="tipped-container">
														<p className="row-1">0.0082</p>
														<p className="row-2">ETH Tipped</p>
													</div>
													<div className="tipped-container">
														<p className="row-1">3</p>
														<p className="row-2">Answers</p>
													</div>
													<img src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
													/>
													<p className="post-title">{post.title}</p>
													<p className="text-muted post-author">{post.author}</p>
												</div>
											</div>
										)
									})}
								</div>
							}
							
						</div>
						<div className="pagination-right" onClick={this.nextPage}>
							<p>&#62;</p>
						</div>
					</div>
				</main>
			</div>
		);
	}
}

export default Main;