const express = require('express')
var cors = require('cors')
const fs = require('fs');

const app = express()
app.use(cors())

app.use(express.json({extended: true, limit: '1mb'}))

const port = 3001

const GeoAddress = require('../build/contracts/GeoAddress.json');
const GeoObjects = require('../build/contracts/GeoObjects.json');
const Web3 = require('web3');
const { response } = require('express');
const { resolvePtr } = require('dns/promises');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));




async function addPoint (lat, lon, globalId, houseNumber){

	const accounts = await web3.eth.getAccounts();
	const account = accounts[0];
	const contract = new web3.eth.Contract(GeoAddress.abi);


	let contractAddress;


	await contract.deploy({
   		data: GeoAddress.bytecode,
   		arguments: [lat.toString(), lon.toString(), globalId.toString(), houseNumber.toString()]
	}).send({
   		from: account
	}).once('receipt', async (receipt) => {
                    // save address for later
    		contractAddress = receipt.contractAddress;
	})
	
	try {
		// retrieving the contract from the address
		const geoAddress = new web3.eth.Contract(GeoAddress.abi, contractAddress);
		// console.log('account: ', account);
        // console.log('lat/lon ', lat, lon);
		return {
			'account': account,
			'contractAddress': contractAddress,
			'houseNumber': houseNumber
		}
	} catch (error){
		console.log('error: ', error)
	}
}




async function getPoint (contractAddress){
	const accounts = await web3.eth.getAccounts();
	const account = accounts[0];
	// retrieving the contract from the address
	const geoAddress = new web3.eth.Contract(GeoAddress.abi, contractAddress);
	// Free
	try {
		const latitude = await geoAddress.methods.lat().call({
			from: account,
			gas: 1,
		 	gasPrice: 1,
		});
    	const longitude = await geoAddress.methods.lon().call({
			from: account,
			gas: 1,
		 	gasPrice: 1,
		});

		const globalId = await geoAddress.methods.globalId().call({
			from: account,
			gas: 1,
		 	gasPrice: 1,
		});

		const houseNumber = await geoAddress.methods.houseNumber().call({
			from: account,
			gas: 1,
		 	gasPrice: 1,
		});

		// console.log('account: ', account);
		// console.log('globalId: ', globalId);
		// console.log('houseNumber: ', houseNumber);
        // console.log('lat/lon ', latitude, longitude);
		return {
			latitude,
			longitude,
			globalId,
			account,
			contractAddress,
			houseNumber
		}
	} catch (error){
		console.log('error: ', error)
	}
}


async function getHouseNumber(){
	let rawdata = fs.readFileSync('/home/stefan/Desktop/blockchain/dApp/backend/data/house-number.geojson');
	let data = JSON.parse(rawdata);

	let response = data.features;
	let resp = []
	data.features = []
	let lenRes = response.length
	
	for (let i= 0; i<lenRes; i++) {
		try {
			let coord = response[i].geometry.coordinates;
			let lat = coord[0];
			let lon = coord[1];
			let globalId = Math.floor(Math.random() * 1000000);
			let res = await addPoint(lat, lon, globalId, response[i].properties.kucni_broj);
			response[i].properties.globalId = globalId;
			response[i].properties.account = res.account;
			response[i].properties.contractAddress = res.contractAddress;
			resp[i] = response[i]
		}
		catch(error){
			console.log('error: ', error)
		}
	}
	data.features = resp;
	data = JSON.stringify(data)
	// console.log(data)
	fs.writeFileSync('/home/stefan/Desktop/blockchain/dApp/backend/data/houseNumber.geojson', data);
	console.log('Finished!')
	return 'finished'
}

async function getCadastralObjects(){
	let rawdata = fs.readFileSync('/home/stefan/Desktop/blockchain/dApp/backend/data/cadastral-objects.geojson');
	let data = JSON.parse(rawdata);

	let response = data.features;
	let resp = []
	data.features = []
	let lenRes = response.length
	
	for (let i= 0; i<lenRes; i++) {
		try {
			let coord = response[i].geometry.coordinates;
			let coords = ''
			for(let item of coord[0][0]){
				coords = coords + item.toString() + ';'
			}
			let globalId = Math.floor(Math.random() * 1000000);
			let res = await addCadastralObjects(coords, globalId, response[i].properties.brdelaparc, response[i].properties.brparcele);
			response[i].properties.globalId = globalId;
			response[i].properties.account = res.account;
			response[i].properties.contractAddress = res.contractAddress;
			resp[i] = response[i]
		}
		catch(error){
			console.log('error: ', error)
		}
	}
	data.features = resp;
	data = JSON.stringify(data)
	// console.log(data)
	fs.writeFileSync('/home/stefan/Desktop/blockchain/dApp/backend/data/cadastralObjects.geojson', data);
	console.log('Finished!')
	return 'finished'
}

async function addCadastralObjects(coord, globalId, objectNumber, parcelNumber){

	const accounts = await web3.eth.getAccounts();
	const account = accounts[0];
	const contract = new web3.eth.Contract(GeoObjects.abi);


	let coords = ''
	for(let item of coord[0][0]){
		coords = coords + item.toString() + ';'
	}

	let contractAddress;


	await contract.deploy({
   		data: GeoObjects.bytecode,
   		arguments: [coords.toString(), globalId.toString(), objectNumber.toString(),  parcelNumber.toString()]
	}).send({
   		from: account
	}).once('receipt', async (receipt) => {
                    // save address for later
    		contractAddress = receipt.contractAddress;
	})
	
	try {
		// retrieving the contract from the address
		const geoObjects = new web3.eth.Contract(GeoObjects.abi, contractAddress);
		// console.log('account: ', account);
        // console.log('lat/lon ', lat, lon);
		return {
			'account': account,
			'contractAddress': contractAddress
		}
	} catch (error){
		console.log('error: ', error)
	}
}

async function getObjects (contractAddress){
	const accounts = await web3.eth.getAccounts();
	const account = accounts[0];
	// retrieving the contract from the address
	const geoObjects = new web3.eth.Contract(GeoObjects.abi, contractAddress);
	// Free
	try {
		const coords = await geoObjects.methods.coords().call({
			from: account,
			gas: 1,
		 	gasPrice: 1,
		});

		const globalId = await geoObjects.methods.globalId().call({
			from: account,
			gas: 1,
		 	gasPrice: 1,
		});

		const objectNumber = await geoObjects.methods.objectNumber().call({
			from: account,
			gas: 1,
		 	gasPrice: 1,
		});

		const parcelNumber = await geoObjects.methods.parcelNumber().call({
			from: account,
			gas: 1,
		 	gasPrice: 1,
		});

		// console.log('account: ', account);
		// console.log('globalId: ', globalId);
        // console.log('coords', coords);
		// console.log('parcelNumber', parcelNumber);
		return {
			coords,
			globalId,
			account,
			contractAddress,
			objectNumber,
			parcelNumber
		}
	} catch (error){
		console.log('error: ', error)
	}
}

app.post('/addPoint', async (req, res) => {
	console.log(req.body)
	const lat = req.body.lat
	const lon = req.body.lon
	const globalId = req.body.globalId
	const houseNumber = req.body.houseNumber
	const response = await addPoint(lat, lon, globalId, houseNumber);

  	res.json(response)
})

app.post('/getPoint', async (req, res) => {
	let contractAddress = req.body.contractAddress
	console.log('id: ', contractAddress)
	const response = await getPoint(contractAddress);

  	res.json(response);
})

app.get('/getHouseNumber', async(req, res)=>{
	const rawdata = fs.readFileSync('/home/stefan/Desktop/blockchain/dApp/backend/data/houseNumber.geojson');
	const response = JSON.parse(rawdata);
	res.json(response);
})

app.get('/getCadastralObjects', async(req, res)=>{
	const rawdata = fs.readFileSync('/home/stefan/Desktop/blockchain/dApp/backend/data/cadastralObjects.geojson');
	const response = JSON.parse(rawdata);
	res.json(response);
})

app.post('/getObjects', async (req, res) => {
	let contractAddress = req.body.contractAddress
	const response = await getObjects(contractAddress);

  	res.json(response);
})

app.post('/addObject', async (req, res) => {
	console.log(req.body)
	const coord = req.body.coordi
	const objectNumber = req.body.objectNumber
	const globalId = req.body.globalId
	const parcelNumber = req.body.parcelNumber
	const response = await addCadastralObjects(coord, globalId, objectNumber, parcelNumber);

  	res.json(response)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// getHouseNumber();
// getCadastralObjects()
