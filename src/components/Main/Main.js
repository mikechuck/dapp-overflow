import React, { useState, useEffect, useRef } from 'react';
import './Main.css';
import QuestionList from './components/QuestionList/QuestionList'

const Main = (props) => {
	// State fields
	const [error, setError] = useState(false)
	const [posts, setPosts] = useState([])
	const [loadingPosts, setLoadingPosts] = useState(true)
	const [loadingNextPage, setLoadingNextPage] = useState(false)
	const [loadingPreviousPage, setLoadingPreviousPage] = useState(false)
	const [pageNumber, setPageNumber] = useState(1)
	const [postsPerPage, setPostsPerPage] = useState(5)
	const [postCount, setPostCount] = useState(0)
	const [postQuestion, setPostQuestion] = useState('')
	const [postTitle, setPostTitle] = useState('')
	const [postTopic, setPostTopic] = useState('')
	const [fileName, setFileName] = useState('')
	const hiddenFileInput = useRef(null)

	
	useEffect(() => {
		// Your code here	
		console.log('postCount:', postCount)
		new Promise((resolve, reject) => {
			try {
				getPosts()
			} catch (err) {
				console.log("err:", err)
				setError(true)
			}
			resolve()
		})
	}, []);

	const getPosts = () => {
		let postCountValue;
		new Promise((resolve, reject) => {
			postCountValue = props.dappOverflow.methods.postCount().call()
		}).then(() => {
			setPostCount(postCountValue.toString(10))
		})

		if (postCount > 0) {
			let startIndex = ((pageNumber - 1) * postsPerPage) + 1
			let endIndex = pageNumber * postsPerPage
	
			let postsArray = []
	
			for (var i = startIndex; i <= endIndex && i <= postCount; i++) {
				console.log("i:", i)
				new Promise((resolve, reject) => {
					const post = props.dappOverflow.methods.posts(i).call()
					postsArray.push(post)
					resolve()
				})
			}
			console.log("settingPosts:", postsArray)
			setPosts(postsArray.sort((a, b) => b.tipAmount - a.tipAmount))
		}
		setLoadingPosts(false)
	};

	const fileInputClick = () => {
		hiddenFileInput.current.click();
	};

	const previousPage = () => {
		if (pageNumber > 1) {
			setPageNumber(pageNumber - 1);
			setLoadingPosts(true);
	
			new Promise((resolve, reject) => {
				getPosts()
				resolve()
			})
		}
	};

	const nextPage = () => {
		let maxPages = Math.ceil(postCount / postsPerPage)
		if (pageNumber < maxPages) {
			setPageNumber(pageNumber + 1);
			setLoadingPosts(true);
	
			new Promise((resolve, reject) => {
				getPosts()
				resolve()
			})
		}
	};

	const captureFile = event => {
		event.preventDefault()
		const file = event.target.files[0]
		setFileName(file.name)
		props.captureFile(file)
	}

	const selectQuestion = (post) => {
		console.log("selecting question:", post)
	};

	let totalNumPages = Math.ceil(postCount / postsPerPage)
	return (
		<div className="main-container">
			{/* {postsPerPage} */}
			<main role="main">
				<div className="form-container">
					<h2 className="form-title">Ask a Question</h2>
					<form onSubmit={(event) => {
						event.preventDefault()
						const question = postQuestion.value
						const title = postTitle.value
						const topic = postTopic.value
						props.createPost(title, topic, question)
					}}>
						<input className="file-input" type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={captureFile} ref={hiddenFileInput}/>
						<div className="file-select-container">
							<button className="btn file-select-button" onClick={fileInputClick}>Choose File</button>
							<label className="file-label">
								{fileName ?
									fileName
									:
									"No File Chosen"
								}
							</label>
						</div>
						<div className="form-group mr-sm-2">
							<input className="title-input form-control" type="text" ref={(input) => { setPostTitle(input) }} placeholder="Title" required />
							<select className="topic-select form-control" ref={(option) => { setPostTopic(option) }}>
								<option className="topic-option" value="Solidity">Solidity</option>
							</select>
							<textarea id="postQuestion" type="text" ref={(input) => { setPostQuestion(input) }} className="form-control" placeholder="What do you want to know?" required />
						</div>
						<button type="submit" className="btn btn-primary btn-block btn-lg submit-button" disabled={props.savingQuestion}>
							{props.savingQuestion ?
								"Saving..."
								:
								"Submit"
							}
						</button>
					</form>
				</div>
				<div className="questions-top">
					<h4 className="questions-header">Questions</h4>
					<p className="pages-info">Page {pageNumber} of {totalNumPages}</p>
				</div>					
				<div className="bottom-section">
					{(postCount > 0) ?
						<div>
							<div className="pagination-left" onClick={previousPage}>
								<p>&#60;</p>
							</div>
							<div className='carousel'>
								<QuestionList
									posts={posts}
									dappOverflow={props.dappOverflow}
									isLoading={loadingPosts}
									selectQuestion={selectQuestion}
								/>
							</div>
							<div className="pagination-right" onClick={nextPage}>
								<p>&#62;</p>
							</div>
						</div>
						:
						<div className="empty-container">
							<p>No questions so far...</p>
						</div>
					}
				</div>
			</main>
		</div>
	);
}


export default Main;