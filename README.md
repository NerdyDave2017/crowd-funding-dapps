# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

// Things I missed in the tutorial:

1. The duration input should be in days, so I have to multiply by 1 days in the smart contract.
2. The contribute function should have a require statement to check if the campaign target has been met.
3. Create campaign ended event and emit it when the campaign is ended.
4. Add require statement inside constructor to check if owner address is equal to a zero address.
5. Add require statement inide constructor to check if duration is less than 1 day.
6. Add require statement inside constructor to check if target is greater than 0.
