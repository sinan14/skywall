// Cash owes to customer: 51
// No. of 20s : 2
// No. of 10s : 1
// No. of 5s : 0
// No. of 1s : 1
// Total coins: 4
function coins(amount) {
  //   const amount = Math.floor(amount);
  let remainingAmount;
  function setRemaining(coin, value) {
    if (value === 20) remainingAmount = amount - coin * value;
    else remainingAmount = remainingAmount - coin * value;
  }

  const twentyCoins = Math.floor(amount / 20);
  setRemaining(twentyCoins, 20);
  const tenCoins = Math.floor(remainingAmount / 10);
  setRemaining(tenCoins, 10);
  const fiveCoins = Math.floor(remainingAmount / 5);
  setRemaining(fiveCoins, 5);
  //print 
  console.log(`No of 20s is ${twentyCoins}`);
  console.log(`No of 10s is ${tenCoins}`);
  console.log(`No of 5s is ${fiveCoins}`);
  console.log(`No of 1s is ${Math.floor(remainingAmount)}`);
}
coins(39.5);
