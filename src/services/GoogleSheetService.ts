
import axios from "axios";
import { Expense } from "../models/expense";

const SCRIPT_URL = import.meta.env.VITE_APP_SCRIPT;

export class GoogleSheetService {
    async readRows() {
        try {
            const response = await axios.get(SCRIPT_URL);
            if (typeof response.data === "string") {
                return JSON.parse(response.data);
            }
            return response.data;
        } catch (error) {
            console.error("Failed to fetch data from Google Apps Script:", error);
            return [];
        }
    }

    async appendRow(row: Expense) {
        try {
            const response = await axios.post(SCRIPT_URL + '?action=add', row, {
                headers: { 'Content-Type': 'text/plain'  }
            });
            return response.data;
        } catch (error) {
            console.error("Failed to append data to Google Apps Script:", error);
            throw error;
        }
    }

    async updateRow(row: Expense) {
        try {
            const response = await axios.post(SCRIPT_URL + '?action=update', row, {
                headers: { 'Content-Type': 'text/plain'  }
            });
            return response.data;
        } catch (error) {
            console.error("Failed to update data in Google Apps Script:", error);
            throw error;
        }
    }

    async deleteRow(row: Expense) {
        try {
            const response = await axios.post(SCRIPT_URL + '?action=delete', row, {
                headers: { 'Content-Type': 'text/plain'  }
            });
            return response.data;
        } catch (error) {
            console.error("Failed to delete data in Google Apps Script:", error);
            throw error;
        }
    }
}