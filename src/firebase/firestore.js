import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
Timestamp,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from './config.js';

// Collections
const INCOME_COLLECTION = 'income';
const EXPENSE_COLLECTION = 'expenses';

// Income functions
export const addIncome = async (incomeData) => {
  try {
    const docRef = await addDoc(collection(db, INCOME_COLLECTION), {
      ...incomeData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding income:', error);
    return { success: false, error: error.message };
  }
};

export const getIncomes = async (filters = {}) => {
  try {
    let q = collection(db, INCOME_COLLECTION);
    
    // Apply filters if provided
    if (filters.startDate && filters.endDate) {
      q = query(q, 
        where('createdAt', '>=', filters.startDate),
        where('createdAt', '<=', filters.endDate),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(q, orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    const incomes = [];
    
    querySnapshot.forEach((doc) => {
      incomes.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });
    
    return { success: true, data: incomes };
  } catch (error) {
    console.error('Error getting incomes:', error);
    return { success: false, error: error.message };
  }
};

export const updateIncome = async (id, updateData) => {
  try {
    const docRef = doc(db, INCOME_COLLECTION, id);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating income:', error);
    return { success: false, error: error.message };
  }
};

export const deleteIncome = async (id) => {
  try {
    await deleteDoc(doc(db, INCOME_COLLECTION, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting income:', error);
    return { success: false, error: error.message };
  }
};

// Expense functions
export const addExpense = async (expenseData) => {
  try {
    const docRef = await addDoc(collection(db, EXPENSE_COLLECTION), {
      ...expenseData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding expense:', error);
    return { success: false, error: error.message };
  }
};

export const getExpenses = async (filters = {}) => {
  try {
    let q = collection(db, EXPENSE_COLLECTION);
    
    // Apply filters if provided
    if (filters.startDate && filters.endDate) {
      q = query(q, 
        where('createdAt', '>=', filters.startDate),
        where('createdAt', '<=', filters.endDate),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(q, orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    const expenses = [];
    
    querySnapshot.forEach((doc) => {
      expenses.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });
    
    return { success: true, data: expenses };
  } catch (error) {
    console.error('Error getting expenses:', error);
    return { success: false, error: error.message };
  }
};

export const updateExpense = async (id, updateData) => {
  try {
    const docRef = doc(db, EXPENSE_COLLECTION, id);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating expense:', error);
    return { success: false, error: error.message };
  }
};

export const deleteExpense = async (id) => {
  try {
    await deleteDoc(doc(db, EXPENSE_COLLECTION, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting expense:', error);
    return { success: false, error: error.message };
  }
};

// Analytics functions
export const getFinancialSummary = async (period = 'today') => {
  try {
    const now = new Date();
    let startDate, endDate;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        startDate = weekStart;
        endDate = new Date(weekStart);
        endDate.setDate(weekStart.getDate() + 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    }
    
    const filters = {
      startDate: Timestamp.fromDate(startDate),
      endDate: Timestamp.fromDate(endDate)
    };
    
    const [incomeResult, expenseResult] = await Promise.all([
      getIncomes(filters),
      getExpenses(filters)
    ]);
    
    if (!incomeResult.success || !expenseResult.success) {
      throw new Error('Failed to fetch financial data');
    }
    
    const totalIncome = incomeResult.data.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalExpense = expenseResult.data.reduce((sum, item) => sum + (item.amount || 0), 0);
    const profit = totalIncome - totalExpense;
    
    return {
      success: true,
      data: {
        income: totalIncome,
        expense: totalExpense,
        profit: profit,
        incomeData: incomeResult.data,
        expenseData: expenseResult.data
      }
    };
  } catch (error) {
    console.error('Error getting financial summary:', error);
    return { success: false, error: error.message };
  }
};
export const getFinancialSummary = async (period = 'today') => {
  // ... ໂຄ້ດທີ່ມີຢູ່ແລ້ວ ...
};
// Profile functions
export const updateProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message };
  }
};
