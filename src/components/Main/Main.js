import React, { Component } from 'react';
import Identicon from 'identicon.js';
import './Main.css';

class Main extends Component {

	render() {
		return (
			<div className="container-fluid mt-5 main-container">
				<main role="main" className="row">
					<div className="column-left col-sm-3">
						<div className="topics-container">
							<div className="header">
								<h3>
									Topics
									<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="stream" className="svg-inline--fa fa-stream fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M16 128h416c8.84 0 16-7.16 16-16V48c0-8.84-7.16-16-16-16H16C7.16 32 0 39.16 0 48v64c0 8.84 7.16 16 16 16zm480 80H80c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h416c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16zm-64 176H16c-8.84 0-16 7.16-16 16v64c0 8.84 7.16 16 16 16h416c8.84 0 16-7.16 16-16v-64c0-8.84-7.16-16-16-16z"></path></svg>
								</h3>
							</div>
							<div className="content">
								<ul className="topics-list">
									<li>Solidity</li>
									<li>React</li>
									<li>Ethereum</li>
									<li>Dapps</li>
									<li>DeFi</li>
									<li>Solana</li>
									<li>Othersd</li>
								</ul>
							</div>
						</div>
						<div className="trending-container">
							<div className="header">
								<h3>
									Trending
									<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chart-line" className="svg-inline--fa fa-chart-line fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z"></path></svg>
								</h3>
							</div>
							<div className="content">
								<ul className="trending-list">
									<li>How do I write solidity?</li>
									<li>What is blockchain?</li>
									<li>Invalid DOM property `class`. Did you mean t...</li>
									<li>ERROR: File not found: '../logo.png'</li>
									<li>How do I deploy to the blockchain? I can't s...</li>
									<li>Solana</li>
									<li>Othersd</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="column-middle col-sm-7">
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
					<div className="column-right col-sm-2"></div>
				</main>
			</div>
		);
	}
}

export default Main;