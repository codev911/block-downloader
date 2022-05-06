const { ethers } = require("ethers");
const fs = require("fs");
const process = require("process");
const prompt = require('prompt-sync')();

const rpcaddresses = [
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed.binance.org',
    'https://bsc-dataseed1.ninicoin.io',
    'https://bsc-dataseed2.defibit.io',
    'https://bsc-dataseed3.defibit.io',
    'https://bsc-dataseed4.defibit.io',
    'https://bsc-dataseed2.ninicoin.io',
    'https://bsc-dataseed3.ninicoin.io',
    'https://bsc-dataseed4.ninicoin.io',
    'https://bsc-dataseed1.binance.org',
    'https://bsc-dataseed2.binance.org',
    'https://bsc-dataseed3.binance.org',
    'https://bsc-dataseed4.binance.org'
];

let rpc;

const startBlock = prompt('Where start block you want? : ');
const endBlock = prompt('Where end block you want? : ');

async function initiator(idx){
    rpc = new ethers.providers.JsonRpcProvider(
        rpcaddresses[idx]
    );
    console.log("Connected on rpc : ", rpcaddresses[idx]);
}

async function blockScrapper(){
    for(let a = parseInt(startBlock); a <= parseInt(endBlock); a++){
        try{
            await scrapperExecutor(a);
        }catch(e){
            console.log("retry at block : ", a);

            if(
                e.code === "SERVER_ERROR" ||
                e['code'] === "SERVER_ERROR"
            ){
                const getLength = rpcaddresses.length;
                const getUnixDate = (new Date()).getTime();
                const getRandom = getUnixDate % getLength;

                await initiator(getRandom);
                a = a - 1;
            }else{
                a = a - 1;
            }
        }
    }
}

async function scrapperExecutor(block){
    await rpc.getBlockWithTransactions(block).then(function(blockData){
        if (blockData.transactions.length > 0) {
            console.log(blockData.number, ": processing");
    
            fs.writeFile("./block/"+blockData.number + '.json', JSON.stringify(blockData), function(err) {
                if (err) {
                   return console.error(err);
                }
    
                if(block == parseInt(endBlock)){
                    process.exit();
                }
            });
        }else {
            console.log(blockData.number, ": null");
        }
    });
}

async function go(){
    await initiator(0).then( async function(){
        await blockScrapper();
    });
}

go();
