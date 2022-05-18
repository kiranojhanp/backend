const axios = require("axios")
const cheerio = require("cheerio")
const voteSource = "https://election.onlinekhabar.com/municipal"

async function getVotes(id) {
	try {
		const { data } = await axios.get(`${voteSource}/?municipal_id=${id}`)

		const $ = cheerio.load(data, {
			decodeEntities: false,
		})

		// for mayor candidates
		const elemSelector =
			"#new > div > div.col-6.col-sm-12.m-mb-30 > div > table > tbody > tr"

		const keys = ["name", "party", "votes"]
		const voteArr = []

		$(elemSelector).each((parentIndex, parentElem) => {
			let keyIndex = 0
			const voteObj = {}
			$(parentElem)
				.children()
				.each((childIndex, childElem) => {
					let napaValue = $(childElem).text().trim()

					voteObj[keys[keyIndex]] = napaValue.replace(/\s\s+/g, "")
					keyIndex++
				})

			voteArr.push(voteObj)
		})

		// for upa mayor
		const upaElementSelector =
			"#new > div > div:nth-child(2) > div > table > tbody > tr"
		const upaVoteArr = []

		$(upaElementSelector).each((parentIndex, parentElem) => {
			let keyIndex = 0
			const upaVoteObj = {}
			$(parentElem)
				.children()
				.each((childIndex, childElem) => {
					let napaValue = $(childElem).text().trim()
					upaVoteObj[keys[keyIndex]] = napaValue
					keyIndex++
				})

			upaVoteArr.push(upaVoteObj)
		})

		return { mayor: voteArr, upamayor: upaVoteArr }
	} catch (error) {
		console.log(error)
	}
}

module.exports = { getVotes }
