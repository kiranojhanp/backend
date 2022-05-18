const redis = require("redis")

const client = redis.createClient({ url: `redis://127.0.0.1:6379` })

const run = async () => {
	client.on("connect", () => console.log("Client connected to redis..."))
	client.on("ready", async () =>
		console.log("Client connected to redis and ready to use...")
	)
	client.on("error", (err) => console.log(err.message))
	client.on("end", () => console.log("Client disconnected from redis"))
	process.on("SIGINT", () => client.quit())
	await client.connect()
	await client.ping()
}

run()

module.exports = { client }
