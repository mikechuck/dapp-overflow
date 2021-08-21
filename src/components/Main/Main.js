import React, { Component } from 'react';
import Identicon from 'identicon.js';
import './Main.css';

class Main extends Component {
	componentDidMount() {
		console.log("test")
	}

	render() {
		return (
			<div className="container-fluid mt-5 main-container">
				<main role="main" className="row">
					<div className="form-container col-sm-8">
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
								{/* <input className="topic-input form-control" type="text"  placeholder="Topic" required /> */}
								<textarea id="postQuestion" type="text" ref={(input) => { this.postQuestion = input }} className="form-control" placeholder="What do you want to know?" required />
							</div>
							<button type="submit" className="btn btn-primary btn-block btn-lg submit-button">Submit</button>
						</form>

						<div className="question-card-list">
							<h4 className="questions-header">Questions</h4>
							{this.props.posts.map((post, key) => {
								return (
									<div className="card question-card mb-4" key={key} >
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
					</div>
				</main>
			</div>
		);
	}
}

export default Main;