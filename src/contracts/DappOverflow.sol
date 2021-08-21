pragma solidity ^0.5.0;

contract DappOverflow {
	string public name = "DappOverflow";
	uint public postCount = 0;
	uint public answerCount = 0;

	mapping(uint => Post) public posts;
	mapping(uint => Answer) public answers;
	

	// Models
	struct Post{
		uint id;
		string title;
		string topic;
		string image;
		string question;
		uint tipAmount;
		uint date;
		address payable author;
	}

	struct Answer{
		uint id;
		string postId;
		string content;
		uint tipAmount;
		uint date;
		address payable author;
	}

	// Post events
	event PostCreated(
		uint id,
		string title,
		string topic,
		string image,
		string question,
		uint tipAmount,
		uint date,
		address payable author
	);

	event PostTipped(
		uint id,
		string title,
		string topic,
		string image,
		string question,
		uint tipAmount,
		uint date,
		address payable author
	);

	// Answer events
	event AnswerCreated (
		uint id,
		string postId,
		string content,
		uint tipAmount,
		uint date,
		address payable author
	);

	event AnswerTipped (
		uint id,
		string postId,
		string content,
		uint tipAmount,
		uint date,
		address payable author
	);

	// Create post
	function createPost(
		string memory _title,
		string memory _topic,
		string memory _image,
		string memory _question
	) public {
		require(bytes(_title).length > 0);
		require(bytes(_topic).length > 0);
		require(bytes(_question).length > 0);
		require(msg.sender != address(0x0));

		// Increment post count
		postCount++;

		// Set initial tip to 0 for new posts
		uint tipAmount = 0;
		uint date = now;

		posts[postCount] = Post(postCount, _title, _topic, _image, _question, tipAmount, date, msg.sender);

		emit PostCreated(postCount, _title, _topic, _image, _question, tipAmount, date, msg.sender);
	}


	// Create answer for a post
	function createAnswer(
		string memory _postId,
		string memory _content
	) public {
		require(bytes(_postId).length > 0);
		require(bytes(_content).length > 0);
		require(msg.sender != address(0x0));

		//Increment answer count
		answerCount++;

		uint date = now;
		uint tipAmount = 0;

		answers[answerCount] = Answer(answerCount, _postId, _content, tipAmount, date, msg.sender);

		emit AnswerCreated(answerCount, _postId, _content, tipAmount, date, msg.sender);
	}

	// Tip Post

	// function tipImageOwner(uint _id) public payable {
	// 	require(_id > 0 && _id <= imageCount);

	// 	// Fetch the image
	// 	Image memory _image = images[_id];

	// 	// Fetch the author
	// 	address payable _author = _image.author;

	// 	// Pay the author by sending them Ether
	// 	address(_author).transfer(msg.value);

	// 	// Increment the tip amount
	// 	_image.tipAmount = _image.tipAmount + msg.value;

	// 	// Update the image
	// 	images[_id] = _image;
		
	// 	// Trigger an event
	// 	emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
	// }


	// Tip answer
	// function tipImageOwner(uint _id) public payable {
	// 	require(_id > 0 && _id <= imageCount);

	// 	// Fetch the image
	// 	Image memory _image = images[_id];

	// 	// Fetch the author
	// 	address payable _author = _image.author;

	// 	// Pay the author by sending them Ether
	// 	address(_author).transfer(msg.value);

	// 	// Increment the tip amount
	// 	_image.tipAmount = _image.tipAmount + msg.value;

	// 	// Update the image
	// 	images[_id] = _image;
		
	// 	// Trigger an event
	// 	emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
	// }
}