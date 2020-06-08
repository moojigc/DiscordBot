const { suid } = require("rand-token");

// This function allows user and Dungeon Master to access their inventory from the web.
async function webLogin(message, player) {
	const { MessageEmbed } = require("discord.js");
	const url = process.env.MONGODB_URI ? `https://dnd-inventory-web.herokuapp.com/login/` : `http://localhost:3000/login/`;
	console.log(player.token);
	const token = async () => {
		if (!player.token) {
			let t = suid(16);
			await player.updateOne({ token: t });
			return t;
		} else {
			return player.token;
		}
	};
	let embed = new MessageEmbed().setDescription(`You can [login here](${url}) to manage **${player.name}'s** inventory with a graphical interface.`).addFields({ name: "Token", value: `This is your private token: ${await token()}. Treat it like a password! Don't give it out.` });
	message.author.send(embed);
}

module.exports = webLogin;
