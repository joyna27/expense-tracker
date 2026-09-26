const cron = require('node-cron');
const Transaction = require('../models/Transaction');

function getNextRunDate(current, interval) {
  const next = new Date(current);
  if (interval === 'daily') next.setDate(next.getDate() + 1);
  if (interval === 'weekly') next.setDate(next.getDate() + 7);
  if (interval === 'monthly') next.setMonth(next.getMonth() + 1);
  return next;
}

// Runs once a day at midnight server time
cron.schedule('0 0 * * *', async () => {
  try {
    const due = await Transaction.find({
      isRecurring: true,
      nextRunDate: { $lte: new Date() }
    });

    for (const tx of due) {
      await Transaction.create({
        userId: tx.userId,
        type: tx.type,
        amount: tx.amount,
        category: tx.category,
        description: tx.description,
        date: new Date(),
        isRecurring: false
      });

      tx.nextRunDate = getNextRunDate(tx.nextRunDate, tx.recurrenceInterval);
      await tx.save();
    }

    if (due.length) console.log(`Processed ${due.length} recurring transaction(s)`);
  } catch (err) {
    console.error('Recurring job error:', err.message);
  }
});
