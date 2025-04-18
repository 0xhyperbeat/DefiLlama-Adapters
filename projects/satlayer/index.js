

const { getLogs2 } = require('../helper/cache/getLogs')
const { getUniqueAddresses } = require('../helper/tokenMapping')
const { sumTokens2 } = require('../helper/unwrapLPs')
const factory = '0x42a856dbEBB97AbC1269EAB32f3bb40C15102819'

module.exports = {
  methodology: 'Total amount of BTC staked and restaked on SatLayer.'
}

const config = {
  ethereum: { factory, fromBlock: 20564864 },
  bsc: { factory, fromBlock: 42094094 },
  btr: { factory: "0x2E3c78576735802eD94e52B7e71830e9E44a9a1C", fromBlock: 4532898 },
  berachain: { factory: "0x50198b5E1330753F167F6e0544e4C8aF829BC99d", fromBlock: 262893 },
}

Object.keys(config).forEach(chain => {
  const { factory, fromBlock } = config[chain]
  module.exports[chain] = {
    tvl: async (api) => {
      const logs = await getLogs2({ api, factory, eventAbi: "event CapChanged(address token, uint256 cap)", fromBlock, })
      const tokens = getUniqueAddresses(logs.map(log => log.token))
      return sumTokens2({ api, owner: factory, tokens })
    }
  }
})