"use client";

import { useState, useEffect, useRef } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, BarElement } from 'chart.js';
import jsPDF from 'jspdf';

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend, PointElement, LineElement, BarElement);

interface Transaction {
	_id: string;
	userId: string;
	amount: number;
	category: string;
	date: string;
	description?: string;
}

interface DashboardProps {
	user: string;
}

export default function Dashboard({ user }: DashboardProps) {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [chartType, setChartType] = useState<'pie' | 'bar' | 'line'>('pie');
	const chartRef = useRef<any>(null);

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await fetch(`https://clearcashback.onrender.com/api/transactions/${user}`, {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				});
				if (!response.ok) {
					throw new Error('Failed to fetch transactions');
				}
				const data: Transaction[] = await response.json();
				setTransactions(data);
			} catch (error) {
				console.error('Error fetching transactions:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchTransactions();
	}, [user]);

	if (loading) {
		return <div>Loading...</div>;
	}

	const income = transactions.filter(transaction => transaction.amount > 0).reduce((sum, transaction) => sum + transaction.amount, 0);
	const expenses = transactions.filter(transaction => transaction.amount < 0).reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

	const balanceStatus = income >= expenses ? "Your balance is good, keep it up!" : "Your balance is bad, control your expenses.";

	const data = {
		labels: ['Income', 'Expenses'],
		datasets: [
			{
				label: 'Financial Overview',
				data: [income, expenses],
				backgroundColor: ['rgba(75, 143, 192, 0.6)', 'rgba(255, 77, 77, 0.6)'],
				borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
				borderWidth: 1,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: 'Income vs Expenses',
			},
		},
	};

	const downloadReportPDF = () => {
		const doc = new jsPDF();
		doc.setFontSize(16);
		doc.text('Financial Report', 10, 10);

		const reportData = transactions.map((t) => ({
			Category: t.category,
			Amount: t.amount,
			Date: new Date(t.date).toLocaleDateString(),
			Description: t.description || '',
		}));

		let yPos = 20;
		reportData.forEach((data, index) => {
			doc.text(`Transaction ${index + 1}:`, 10, yPos);
			doc.text(`Category: ${data.Category}`, 10, yPos + 10);
			doc.text(`Amount: ${data.Amount}`, 10, yPos + 20);
			doc.text(`Date: ${data.Date}`, 10, yPos + 30);
			doc.text(`Description: ${data.Description}`, 10, yPos + 40);
			yPos += 50;
		});

		const chart = chartRef.current;
		if (chart) {
			const chartImage = chart.toBase64Image();
			doc.addImage(chartImage, 'PNG', 10, yPos, 180, 100);
		}

		doc.save('financial_report.pdf');
	};

	return (
		<div className="p-4 border border-gray-200 dark:border-gray-600 shadow bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
			<h2 className="text-gray-600 dark:text-gray-200 text-2xl font-bold mb-7 px-1 pt-4">Dashboard</h2>
			<div className="lg:flex justify-evenly items-center">
				<div className="lg:w-1/3 mb-8">
					{chartType === 'pie' && <Pie ref={chartRef} data={data} options={options} />}
					{chartType === 'bar' && <Bar ref={chartRef} data={data} options={options} />}
					{chartType === 'line' && <Line ref={chartRef} data={data} options={options} />}
				</div>
				<div className="text-lg font-semibold mb-4">
					<div className="mb-4">
						<label htmlFor="chartType" className="block text-lg font-semibold mb-2">Select Chart Type:</label>
						<select
							id="chartType"
							value={chartType}
							onChange={(e) => setChartType(e.target.value as 'pie' | 'bar' | 'line')}
							className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2"
						>
							<option value="pie">Pie Chart</option>
							<option value="bar">Bar Chart</option>
							<option value="line">Line Chart</option>
						</select>
					</div>
					<p className={income >= expenses ? "text-green-500" : "text-red-500"}>
						{balanceStatus}
					</p>
					<span className="dark:text-white w-52 block mb-5">Download the PDF with your results and statistics to make it easier and save each month</span>
					<button
						onClick={downloadReportPDF}
						className="bg-blue-500 text-white px-4 py-2 rounded w-56 h-12"
					>
						Download PDF
					</button>
				</div>
			</div>
		</div>
	);
}