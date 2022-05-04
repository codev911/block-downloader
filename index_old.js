const { ethers } = require("ethers");
const fs = require("fs");
const process = require("process");
const prompt = require('prompt-sync')();

// const rpcaddress = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const rpcaddress = 'https://bsc-dataseed1.defibit.io';
const rpc = new ethers.providers.JsonRpcProvider(rpcaddress);

const startBlock = prompt('Where start block you want? : ');
const endBlock = prompt('Where end block you want? : ');

async function blockScrapper(){
    for(let a = parseInt(startBlock); a <= parseInt(endBlock); a++){
        const blockData = await rpc.getBlockWithTransactions(a);
        
        if (blockData.transactions.length > 0) {
            console.log(blockData.number, ": processing");

            fs.writeFile("./block/"+blockData.number + '.json', JSON.stringify(blockData), function(err) {
                if (err) {
                   return console.error(err);
                }

                if(a == parseInt(endBlock)){
                    process.exit();
                }
            });
        }else {
            console.log(blockData.number, ": null");
        }
    }
}

blockScrapper();