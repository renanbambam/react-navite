/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

const dbPromise = SQLite.openDatabaseAsync('finance.db');

const useDatabase = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createTables = async () => {
      try {
        const db = await dbPromise;


        const hasData = async (table: string) => {
            try {
              const db = await dbPromise;
              const result: any = await db.getAllSync(`SELECT COUNT(*) as count FROM ${table}`);
              return result[0].count > 0;
            } catch (err) {
              console.error(err);
              setError((err as Error).message);
              return false;
            }
          };

        const insertTestData = async () => {
            const descriptions = [
                'Venda de produtos A',
                'Pagamento de serviços B',
                'Recebimento de cliente C',
                'Compra de material D',
                'Receita de investimento E',
                'Despesas operacionais F',
                'Venda de ativo G',
                'Receita de comissão H',
                'Pagamento de fornecedor I',
                'Despesas com marketing J',
              ];

            for (let i = 1; i <= 10; i++) {
                const incomeAmount = Math.floor(Math.random() * (40000 - 1000 + 1)) + 1000; // Valor aleatório para receitas
                const expenseAmount = Math.floor(Math.random() * (40000 - 1000 + 1)) + 1000; // Valor aleatório para despesas
                const invoiceAmount = Math.floor(Math.random() * (40000 - 1000 + 1)) + 1000; // Valor aleatório para faturas
                const paymentAmount = Math.floor(Math.random() * (40000 - 1000 + 1)) + 1000; // Valor aleatório para pagamentos
                
                const randomDay = Math.floor(Math.random() * 30) + 1; // Dias de 1 a 30
                const date = `2024-11-${randomDay < 10 ? '0' + randomDay : randomDay}`;
                const description = descriptions[Math.floor(Math.random() * descriptions.length)];
          
              await db.runAsync(`INSERT INTO Incomes (amount, date, description) VALUES (?, ?, ?)`, [incomeAmount, date, description]);
              await db.runAsync(`INSERT INTO Expenses (amount, date, description) VALUES (?, ?, ?)`, [expenseAmount, date, description]);
              await db.runAsync(`INSERT INTO Invoices (amount, issueDate, dueDate, description) VALUES (?, ?, ?, ?)`, [invoiceAmount, date, date, description]);
              await db.runAsync(`INSERT INTO Payments (amount, paymentDate, paymentMethod) VALUES (?, ?, ?)`, [paymentAmount, date, 'Transferência']);
            }
        };

        //funcao apenas para nao sobrebracarregar o local, mas em funcionamento nao teria
        const cleanUpTable = async (table: string) => {
            const db = await dbPromise;
            const result: any = await db.getAllSync(`SELECT COUNT(*) as count FROM ${table}`);
            
            if (result.count > 20) {
              const excessCount = result.count - 20;
              await db.runAsync(`DELETE FROM ${table} WHERE id IN (
                SELECT id FROM ${table} ORDER BY id ASC LIMIT ?
              )`, [excessCount]);
            }
          };

        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS Enterprises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
          );
        `);
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS Incomes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            description TEXT
          );
        `);
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS Expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            description TEXT
          );
        `);
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS Invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            issueDate TEXT NOT NULL,
            dueDate TEXT NOT NULL,
            description TEXT
          );
        `);
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS Payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            paymentDate TEXT NOT NULL,
            paymentMethod TEXT NOT NULL
          );
        `);
        
        const hasIncomeData = await hasData('Incomes')
        const hasExpensesData = await hasData('Expenses')
        const hasInvoicesData = await hasData('Invoices')
        const hasPaymentsData = await hasData('Payments')

        if (!hasIncomeData && !hasExpensesData && !hasInvoicesData && !hasPaymentsData) {
            insertTestData();
        }

        await cleanUpTable('Incomes');
        await cleanUpTable('Expenses');
        await cleanUpTable('Invoices');
        await cleanUpTable('Payments');
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    createTables();
  }, []);

  const addData = async (table: string, data: Record<string, any>) => {
    try {
      const db = await dbPromise;
      const keys = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);
      console.log(`INSERT INTO ${table} (${keys}) VALUES (${placeholders}), ${values}`);
      await db.runAsync(`INSERT INTO ${table} (${keys}) VALUES (${placeholders})`, values);
    } catch (err) {
        console.error(err);
      throw new Error((err as Error).message);
    }
  };

  const fetchData = async (table: string) => {
    try {
      const db = await dbPromise;
      const result = await db.getAllAsync(`SELECT * FROM ${table}`);
      return result;
    } catch (err) {
        console.error(err);
      throw new Error((err as Error).message);
    }
  };

  const updateData = async (table: string, data: Record<string, any>, id: number) => {
    try {
      const db = await dbPromise;
      const updates = Object.keys(data).map((key) => `${key} = ?`).join(', ');
      const values = [...Object.values(data), id];

      await db.runAsync(`UPDATE ${table} SET ${updates} WHERE id = ?`, values);
    } catch (err) {
        console.error(err);
      throw new Error((err as Error).message);
    }
  };

  const deleteData = async (table: string, id: number) => {
    try {
      const db = await dbPromise;
      await db.runAsync(`DELETE FROM ${table} WHERE id = ?`, [id]);
    } catch (err) {
        console.error(err);
      throw new Error((err as Error).message);
    }
  };

  return {
    loading,
    error,
    addData,
    fetchData,
    updateData,
    deleteData,
  };
};

export default useDatabase;