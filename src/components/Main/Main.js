import React, { Component } from 'react';
import Identicon from 'identicon.js';
import './Main.css';

class Main extends Component {

	render() {
		return (
			<div className="container-fluid mt-5 main-container">
				<main role="main" className="row">
					<div className="column-middle col-sm-6">
						<h2>Ask a Question</h2>
						<form onSubmit={(event) => {
							event.preventDefault()
							const question = this.postQuestion.value
							const title = this.postTitle.value
							this.props.createPost(title, "defi", question)
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

						<p>&nbsp;</p>
						{this.props.posts.map((post, key) => {
							return (
								<div className="card question-card mb-4" key={key} >
									<div className="card-header">
										<img
											className='mr-2'
											width='30'
											height='30'
											src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
										/>
										<small className="text-muted">{post.author}</small>
									</div>
									<ul id="postList" className="list-group list-group-flush">
										<li className="list-group-item container">
											<div className="post-container col-sm-3">
												<img src={`https://ipfs.infura.io/ipfs/${post.image}`} />
											</div>
											<div className="question-container col-sm-9">
												<p>{post.question}</p>
											</div>
										</li>
										<li key={key} className="list-group-item py-2">
											<small className="float-left mt-1 text-muted">
												TIPS: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
											</small>
											<button
												className="btn btn-link btn-sm float-right pt-0"
												name={post.id}
												onClick={(event) => {
													let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
													console.log(event.target.name, tipAmount)
													this.props.tipPostOwner(event.target.name, tipAmount)
												}}
											>
												TIP 0.1 ETH
											</button>
										</li>
									</ul>
								</div>
							)
						})}
					</div>
				</main>
			</div>
		);
	}
}

export default Main;