const { assert } = require('chai')

const DappOverflow = artifacts.require('./DappOverflow.sol')

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('DappOverflow', ([deployer, author, tipper]) => {
	let dappOverflow

	before(async () => {
		dappOverflow = await DappOverflow.deployed()
	})

	describe('deployment', async () => {
		it('deploys successfully', async () => {
			const address = await dappOverflow.address
			assert.notEqual(address, 0x0)
			assert.notEqual(address, '')
			assert.notEqual(address, null)
			assert.notEqual(address, undefined)
		})

		it('has a name', async () => {
			const name = await dappOverflow.name()
			assert.equal(name, 'DappOverflow')
		})
	})

	describe('Posts', async () => {
		let result
		const postTitle = 'post title'
		const postTopic = 'post topic'
		const imageHash = 'abc123'
		const postQuestion = 'post question'

		before(async () => {
			result = await dappOverflow.createPost(postTitle, postTopic, imageHash, postQuestion, { from: author })
		})

		it('creates posts', async () => {
			// SUCCESS
			const event = result.logs[0].args
			assert.equal(event.id, '0', 'id is correct')
			assert.equal(event.title, postTitle, 'title is correct')
			assert.equal(event.topic, postTopic, 'topic is correct')
			assert.equal(event.image, imageHash, 'image hash is correct')
			assert.equal(event.question, postQuestion, 'question is correct')

			// FAILURE:  Post must have title
			await dappOverflow.createPost('', postTopic, imageHash, postQuestion, { from: author }).should.be.rejected;
			
			// FAILURE:  Post must have topic
			await dappOverflow.createPost(postTitle, '', imageHash, postQuestion, { from: author }).should.be.rejected;

			// FAILURE:  Post must have a question
			await dappOverflow.createPost(postTitle, postTopic, imageHash, '', { from: author }).should.be.rejected;
		})

		// it('lists images', async () => {
		// 	const image = await dappOverflow.images(imageCount)
		// 	assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
		// 	assert.equal(image.hash, hash, 'hash is correct')
		// 	assert.equal(image.description, 'Image description', 'description is correct')
		// 	assert.equal(image.tipAmount, '0', 'tip amount is correct')
		// 	assert.equal(image.author, author, 'author is correct')
		// })

		// it('allows users to tip images', async () => {
		// 	// Track the author balance before purchase
		// 	let oldAuthorBalance
		// 	oldAuthorBalance = await web3.eth.getBalance(author)
		// 	oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

		// 	result = await dappOverflow.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

		// 	// SUCCESS
		// 	const event = result.logs[0].args
		// 	assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
		// 	assert.equal(event.hash, hash, 'hash is correct')
		// 	assert.equal(event.description, 'Image description', 'description is correct')
		// 	assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
		// 	assert.equal(event.author, author, 'author is correct')

		// 	// Check that author received funds
		// 	let newAuthorBalance
		// 	newAuthorBalance = await web3.eth.getBalance(author)
		// 	newAuthorBalance = new web3.utils.BN(newAuthorBalance)

		// 	let tipImageOwner
		// 	tipImageOwner = web3.utils.toWei('1', 'Ether')
		// 	tipImageOwner = new web3.utils.BN(tipImageOwner)

		// 	const expectedBalance = oldAuthorBalance.add(tipImageOwner)
		// 	assert.equal(newAuthorBalance.toString(), expectedBalance.toString())
		// 	// FAILURE: Tries to tip an image that does not exist
		// 	await dappOverflow.tipImageOwner(99, {from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
		// })
	})

	describe('answers', async () => {
		let result
		const answerContent = 'this is the answer'

		before(async () => {
			result = await dappOverflow.createAnswer(
				'0',
				answerContent,
				{ from: author }
			)
		})

		it('creates answer', async () => {
			// SUCCESS
			const event = result.logs[0].args
			assert.equal(event.id, '0', 'id is correct')
			assert.equal(event.postId, '0', 'post id is correct')
			assert.equal(event.content, answerContent, 'content is correct')

			// FAILURE:  Answer must have post Id
			await dappOverflow.createPost('', answerContent, { from: author }).should.be.rejected;

			// FAILURE:  Answer must have contemt
			await dappOverflow.createPost('0', '', { from: author }).should.be.rejected;
		})
	})
})