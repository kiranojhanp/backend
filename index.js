const express = require("express")
const { client } = require("./init_redis")
const { getVotes } = require("./shared")

const app = express()

app.get("/api/votes/:id", async (req, res) => {
	try {
		// send from redis if needed
		const reply = await client.GET(`municipal-votes`)
		if (reply) return res.status(200).json({ data: JSON.parse(reply) })

		const votes = await getVotes(req.params.id)
		// cache data every 5 seconds
		await client.setEx("municipal-votes", 5, JSON.stringify(votes))
		return res.status(200).json({ data: votes })
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
})

app.listen(3000, () => console.log(`running on port 3000`))
