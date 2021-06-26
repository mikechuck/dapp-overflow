pragma solidity ^0.5.0;

contract Decentragram {
	string public name = "Decentragram";

	mapping(string => Post) public posts;

	struct Post{
		string id;
		string title;
		string topic;
		string image;
		string question;
		uint tipAmount;
		uint date;
		address payable author;
	}

	event PostCreated(
		string id,
		string title,
		string topic,
		string image,
		string question,
		uint tipAmount,
		uint date,
		address payable author
	);

	event PostTipped(
		string id,
		string title,
		string topic,
		string image,
		string question,
		uint tipAmount,
		uint date,
		address payable author
	);

	// Create post
	function createPost(
		string memory _id, 
		string memory _title,
		string memory _topic,
		string memory _image,
		string memory _question,
		uint _tipAmount,
		uint _date
	) public {
		require(bytes(_id).length > 0);
		require(bytes(_title).length > 0);
		require(bytes(_topic).length > 0);
		require(bytes(_image).length > 0);
		require(bytes(_question).length > 0);
		require(_tipAmount > 0);
		require(_date > 0);
		require(msg.sender != address(0x0));

		posts[_id] = Post(_id, _title, _topic, _image, _question, _tipAmount, _date, msg.sender);

		emit PostCreated(_id, _title, _topic, _image, _question, _tipAmount, _date, msg.sender);
	}

	// Tip images
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