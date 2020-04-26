import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface ListAllTransaction {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): ListAllTransaction {
    const balance = this.getBalance();

    const listAllTransaction: ListAllTransaction = {
      transactions: this.transactions,
      balance,
    };

    return listAllTransaction;
  }

  public getBalance(): Balance {
    let income = 0;
    let outcome = 0;

    this.transactions.forEach(transaction => {
      if (transaction.type === 'income') income += transaction.value;
      else outcome += transaction.value;
    });

    const balance: Balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }

  public create({ title, type, value }: CreateTransaction): Transaction {
    if (type === 'outcome') {
      const balance = this.getBalance();

      if (value > balance.total) {
        throw Error(
          `(${value}) is greater then Total available to withdraw, total: (${balance.total})`,
        );
      }
    }
    const transaction = new Transaction({ title, type, value });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
