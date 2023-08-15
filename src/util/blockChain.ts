import TronWeb from 'tronweb';
import Config from './config';
const chain = Config.chain;

const DATA_LEN = 64;
export const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const privateKey = chain.privateKey;

export const mainchain = new TronWeb({
  fullHost: chain.fullHost
});