import React from 'react';
import Identicon from 'identicon.js';
import './QuestionList.css';

const QuestionList = (props) => {
	return (
		(props.isLoading) ?
			<div className='question-card-list'>
				{props.posts.map((post, key) => {
					return (
						<div className="card question-card loading" key={key} >
						</div>
					);
				})}
			</div>
			:
			<div className="question-card-list">
				{props.posts.map((post, key) => {
					return (
						<div className="card question-card" key={key} onClick={(event) => {
							props.selectQuestion(post)
						}}>
							<div className="content">
								<div className="tipped-container">
									<p className="row-1">0.0082</p>
									<p className="row-2">ETH Tipped</p>
								</div>
								<div className="tipped-container">
									<p className="row-1">3</p>
									<p className="row-2">Answers</p>
								</div>
								<img src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`} alt="Author icon"/>
								<p className="post-title">{post.title}</p>
								<p className="text-muted post-author">{post.author}</p>
							</div>
						</div>
					)
				})}
			</div>
	);
};

export default QuestionList;