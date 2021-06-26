const { assert } = require('chai')

const Decentragram = artifacts.require('./Decentragram.sol')

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Decentragram', ([deployer, author, tipper]) => {
	let decentragram

	before(async () => {
		decentragram = await Decentragram.deployed()
	})

	describe('deployment', async () => {
		it('deploys successfully', async () => {
			const address = await decentragram.address
			assert.notEqual(address, 0x0)
			assert.notEqual(address, '')
			assert.notEqual(address, null)
			assert.notEqual(address, undefined)
		})

		it('has a name', async () => {
			const name = await decentragram.name()
			assert.equal(name, 'Decentragram')
		})
	})

	describe('posts', async () => {
		let result
		const imageHash = 'abc123'
		const postId = '4c9d7d0d-450e-4133-bdb8-26c61b38a0eb'

		before(async () => {
			result = await decentragram.createPost(
				postId,
				'post title',
				'post topic',
				imageHash,
				'post question',
				'1000',
				'1624622336',
				{ from: author }
			)
		})

		it('creates posts', async () => {
			// SUCCESS
			const event = result.logs[0].args
			assert.equal(event.id, postId, 'id is correct')

			// FAILURE:  post must have id
			await decentragram.createPost(
				'',
				'post title',
				'post topic',
				imageHash,
				'post question',
				'1000',
				'1624622336',
				{ from: author }
			).should.be.rejected;

			// FAILURE:  Post must have title
			await decentragram.createPost(
				postId,
				'',
				'post topic',
				imageHash,
				'post question',
				'1000',
				'1624622336',
				{ from: author }
			).should.be.rejected;
			
			// FAILURE:  Post must have title
			await decentragram.createPost(
				postId,
				'',
				'post topic',
				imageHash,
				'post question',
				'1000',
				'1624622336',
				{ from: author }
			).should.be.rejected;
		})

		// it('lists images', async () => {
		// 	const image = await decentragram.images(imageCount)
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

		// 	result = await decentragram.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

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
		// 	await decentragram.tipImageOwner(99, {from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
		// })
	})
})