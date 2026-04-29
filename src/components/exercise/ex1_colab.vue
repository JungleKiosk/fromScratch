<template>
  <main class="dataset-page">
    <section class="hero">
      <div>
        <p class="eyebrow">Marketing Analytics</p>
        <h1>Customer Segmentation Dataset</h1>
        <p class="hero-text">
          This dataset is widely used for marketing analytics, CRM analysis,
          customer segmentation and basic machine learning exercises.
        </p>
        You can find the dataset on Kaggle by clicking the link:
        <a style="text-decoration: underline; color: black;"
          href="https://www.kaggle.com/datasets/jackdaoud/marketing-data/data" target="_blank"
          rel="noopener noreferrer">
          Download the dataset on Kaggle
        </a>
        <br>
        <br>
        <h5>What is inside the Kaggle ZIP file?</h5>

        <ul class="hero-text">
          <li>The ZIP file downloaded from Kaggle contains a CSV file with the marketing</li>
          <li>dataset and a PNG image that describes the meaning of the dataset variables.</li>
        </ul>
      </div>
      <a style="text-decoration: none; color: black;" href="#code_colab">Go to code ⛵</a>  
    </section>

    <section class="intro-card">
      <h5>How to open the CSV correctly</h5>

      <p class="hero-text">
        Sometimes the CSV file may not display correctly when opened in spreadsheet
        software like :contentReference[oaicite:1]{index=1} or :contentReference[oaicite:2]{index=2} because of
        separator settings.
        <a href="https://www.youtube.com/watch?v=Z8hH-PSRDOw" target="_blank" rel="noopener noreferrer">
          Watch this tutorial
        </a>
        <br>
        If all the values appear in a single column, follow these steps:
      </p>

      <ul class="csv-steps">
        <li>Open the CSV file in Excel</li>
        <li>Select the first column</li>
        <li>Click on <strong>Data</strong></li>
        <li>Choose <strong>Text to Columns</strong></li>
        <li>Select <strong>Delimited</strong></li>
        <li>Choose the correct separator:</li>
        <ul>
          <li><strong>Comma (,)</strong> → common in US datasets</li>
          <li><strong>Semicolon (;)</strong> → common in European datasets</li>
        </ul>
        <li>Click Finish</li>
      </ul>

      <p class="hero-text">
        After that, the dataset columns should appear correctly separated.
      </p>
    </section>

    <section class="intro-card">
      <h2>What can you analyze?</h2>
      <p>
        The variables are grouped into categories so you can quickly understand
        customer demographics, spending behavior, purchase channels, campaign
        response and retention.
      </p>
    </section>

    <section class="intro-card">
      <h2>👇 Legend for the variables in the dataset, grouped by category 👇</h2>
    </section>

    <section class="section-grid">
      <article v-for="section in sections" :key="section.title" class="category-card">
        <div class="category-header">
          <span class="category-icon">{{ section.icon }}</span>
          <h2>{{ section.title }}</h2>
        </div>

        <p v-if="section.description" class="category-description">
          {{ section.description }}
        </p>

        <div class="variable-list">
          <div v-for="item in section.variables" :key="item.name" class="variable-card">
            <h3>
              <code>{{ item.name }}</code>
            </h3>
            <p>{{ item.description }}</p>

            <ul v-if="item.examples">
              <li v-for="example in item.examples" :key="example">
                {{ example }}
              </li>
            </ul>

            <blockquote v-if="item.analysis">
              {{ item.analysis }}
            </blockquote>
          </div>
        </div>
      </article>
    </section>

    <section class="questions-section">
      <div class="section-title">
        <p class="eyebrow">Practice</p>
        <h2>Real Data Analyst questions</h2>
      </div>

      <div class="question-grid">
        <article v-for="question in questions" :key="question.title" class="question-card">
          <h3>{{ question.title }}</h3>
          <pre><code>{{ question.code }}</code></pre>
        </article>
      </div>
    </section>

    <section class="skills-card">
      <h2>This dataset is excellent for learning</h2>
      <div class="skill-list">
        <span v-for="skill in skills" :key="skill" class="skill-pill">
          {{ skill }}
        </span>
      </div>
    </section>

    <section id="code_colab" class="guide-section">
      <div class="section-title">
        <p class="eyebrow">Google Colab</p>
        <h2>Python for Market Data Analysis</h2>
        <p>
          A beginner-friendly guide to start analyzing marketing and ecommerce datasets
          with Google Colab, pandas and basic statistics.
        </p>
      </div>

      <div class="guide-grid">
        <article v-for="guide in colabGuide" :key="guide.title" class="guide-card">
          <h3>{{ guide.title }}</h3>
          <p v-if="guide.description">{{ guide.description }}</p>

          <ul v-if="guide.items">
            <li v-for="item in guide.items" :key="item">
              {{ item }}
            </li>
          </ul>

          <div v-if="guide.code" class="code-container">
            <button class="copy-btn" @click="copyCode(guide.code)">
              Copy
            </button>

            <pre>
              <code>{{ guide.code }}</code>
            </pre>
          </div>
        </article>
      </div>
    </section>

  </main>
</template>

<script setup>

const copyCode = async (code) => {
  try {
    await navigator.clipboard.writeText(code)
    alert("Code copied!")
  } catch (err) {
    console.error("Copy failed", err)
  }
}
const sections = [
  {
    title: 'Economic / customer demographic variables',
    icon: '👤',
    description: 'Variables that describe the customer profile and household context.',
    variables: [
      {
        name: 'Income',
        description: 'Customer’s annual income.',
        examples: [
          '20,000 → low spending potential customer',
          '80,000 → high spending potential customer'
        ],
        analysis: 'Do high-income customers spend more?'
      },
      {
        name: 'Age',
        description: 'Customer age.',
        analysis: 'Do younger customers buy online more often?'
      },
      {
        name: 'Kidhome',
        description: 'Number of young children in the household.',
        examples: ['0', '1', '2']
      },
      {
        name: 'Teenhome',
        description: 'Number of teenagers in the household.'
      },
      {
        name: 'Customer_Days',
        description: 'How many days the customer has been registered in the system.',
        examples: ['new customers', 'loyal customers']
      }
    ]
  },
  {
    title: 'Spending variables',
    icon: '💰',
    description: 'These columns show how much money was spent on each product category.',
    variables: [
      { name: 'MntWines', description: 'Amount spent on wine.' },
      { name: 'MntFruits', description: 'Amount spent on fruits.' },
      { name: 'MntMeatProducts', description: 'Amount spent on meat.' },
      { name: 'MntFishProducts', description: 'Amount spent on fish.' },
      { name: 'MntSweetProducts', description: 'Amount spent on sweets.' },
      { name: 'MntGoldProds', description: 'Amount spent on premium/gold products.' },
      { name: 'MntTotal', description: 'Total overall spending. Sum of all categories.' },
      { name: 'MntRegularProds', description: 'Spending on regular products, excluding gold products.' }
    ]
  },
  {
    title: 'Purchase behavior variables',
    icon: '🛒',
    variables: [
      {
        name: 'NumDealsPurchases',
        description: 'Number of purchases made using discounts or promotions.',
        analysis: 'Who uses coupons more frequently?'
      },
      { name: 'NumWebPurchases', description: 'Number of online purchases.' },
      { name: 'NumCatalogPurchases', description: 'Number of purchases made through catalogs.' },
      { name: 'NumStorePurchases', description: 'Number of purchases made in physical stores.' },
      {
        name: 'NumWebVisitsMonth',
        description: 'Number of website visits in the last month.',
        examples: ['many visits + few purchases → possible conversion issue']
      }
    ]
  },
  {
    title: 'Marketing campaign variables',
    icon: '📣',
    description: 'These variables are very important for marketing analysts.',
    variables: [
      { name: 'AcceptedCmp1', description: 'Did the customer accept marketing campaign 1? 1 = yes, 0 = no.' },
      { name: 'AcceptedCmp2', description: 'Did the customer accept marketing campaign 2? 1 = yes, 0 = no.' },
      { name: 'AcceptedCmp3', description: 'Did the customer accept marketing campaign 3? 1 = yes, 0 = no.' },
      { name: 'AcceptedCmp4', description: 'Did the customer accept marketing campaign 4? 1 = yes, 0 = no.' },
      { name: 'AcceptedCmp5', description: 'Did the customer accept marketing campaign 5? 1 = yes, 0 = no.' },
      { name: 'AcceptedCmpOverall', description: 'Total number of campaigns accepted.' },
      {
        name: 'Response',
        description: 'Did the customer respond positively to the latest campaign? 1 = yes, 0 = no.',
        analysis: 'This is often used as the target variable in predictive models.'
      }
    ]
  },
  {
    title: 'Customer retention',
    icon: '⏱️',
    variables: [
      {
        name: 'Recency',
        description: 'Number of days since the last purchase.',
        examples: ['5 → recent customer', '90 → inactive customer'],
        analysis: 'Very commonly used in RFM analysis.'
      }
    ]
  },
  {
    title: 'Customer service',
    icon: '🎧',
    variables: [
      { name: 'Complain', description: 'Did the customer submit complaints? 1 = yes, 0 = no.' }
    ]
  },
  {
    title: 'Marital status variables',
    icon: '💍',
    description: 'One-hot encoded columns describing marital status.',
    variables: [
      { name: 'marital_Divorced', description: 'Divorced.' },
      { name: 'marital_Married', description: 'Married.' },
      { name: 'marital_Single', description: 'Single.' },
      { name: 'marital_Together', description: 'Living together / in a relationship.' },
      { name: 'marital_Widow', description: 'Widowed.' }
    ]
  },
  {
    title: 'Education variables',
    icon: '🎓',
    description: 'Variables describing education level.',
    variables: [
      { name: 'education_2n Cycle', description: 'Secondary education cycle.' },
      { name: 'education_Basic', description: 'Basic education.' },
      { name: 'education_Graduation', description: 'Bachelor’s degree / Graduation.' },
      { name: 'education_Master', description: 'Master’s degree.' },
      { name: 'education_PhD', description: 'PhD.' }
    ]
  },
  {
    title: 'Variables not very useful for now',
    icon: '⚠️',
    variables: [
      { name: 'Z_CostContact', description: 'This column is often constant, so it is not very useful.' },
      { name: 'Z_Revenue', description: 'This one is often not very useful as well.' }
    ]
  }
]

const questions = [
  {
    title: 'Which category sells the most?',
    code: "df[['MntWines','MntFruits','MntMeatProducts']].sum()"
  },
  {
    title: 'Who spends the most?',
    code: 'df.groupby("Age")["MntTotal"].mean()'
  },
  {
    title: 'Are marketing campaigns effective?',
    code: 'df["Response"].value_counts()'
  },
  {
    title: 'Who buys online?',
    code: 'df["NumWebPurchases"].describe()'
  },
  {
    title: 'Inactive customers?',
    code: 'df["Recency"].sort_values(ascending=False)'
  }
]

const skills = [
  'pandas',
  'descriptive statistics',
  'customer segmentation',
  'marketing analytics',
  'basic machine learning',
  'CRM analysis'
]

const colabGuide = [
  {
    title: "Upload a CSV file in Colab",
    description:
      "This code imports pandas and opens a file uploader inside Google Colab. After uploading your CSV file, pandas reads it and stores it inside a dataframe called df.",
    code: `import pandas as pd
              from google.colab import files

              uploaded = files.upload()

              df = pd.read_csv("your_file.csv")

              df.head()`
  },

  {
    title: "Upload an Excel file in Colab",
    description:
      "This works exactly like CSV upload, but here pandas reads an Excel file (.xlsx). Very common when companies export reports from Excel.",
    code: `import pandas as pd
              from google.colab import files

              uploaded = files.upload()

              df = pd.read_excel("your_file.xlsx")

              df.head()`
  },

  {
    title: "Explore the dataset",
    description:
      "Before doing analysis, you need to understand your dataset structure. These commands help you inspect rows, columns and data types.",
    code: `df.head()
              df.tail()
              df.shape
              df.info()`
  },

  {
    title: "Basic statistics",
    description:
      "These commands calculate basic descriptive statistics on a numeric column called Sales. This is usually your first step in exploratory data analysis.",
    code: `df["Sales"].mean()
              df["Sales"].median()
              df["Sales"].std()
              df["Sales"].min()
              df["Sales"].max()

              df["Sales"].quantile(0.25)
              df["Sales"].quantile(0.50)
              df["Sales"].quantile(0.75)

              df["Sales"].describe()`
  },

  {
    title: "Simple market analysis",
    description:
      "Here you start answering business questions. Groupby helps you aggregate sales by category, region or product.",
    code: `df.groupby("Category")["Sales"].sum()

              df.groupby("Region")["Sales"].sum()

              df.groupby("Product")["Sales"]
                .sum()
                .sort_values(ascending=False)`
  },

  {
    title: "Basic chart",
    description:
      "This creates a simple bar chart showing total sales by category. Data visualization helps communicate insights to managers or clients.",
    code: `import matplotlib.pyplot as plt

              df.groupby("Category")["Sales"].sum().plot(kind="bar")

              plt.show()`
  },

  {
    title: "Mini exercise",
    description:
      "Imagine you work for an ecommerce company. Try answering these business questions using your dataset.",
    items: [
      "Which category sells the most?",
      "Which region generates the highest revenue?",
      "What is the average order value?",
      "Which products perform the worst?"
    ]
  },

  {
    title: "Simple roadmap",
    description:
      "A simple learning path to become more confident with market data analysis.",
    items: [
      "Week 1: import CSV/Excel, clean data, basic statistics",
      "Week 2: filters, groupby, charts",
      "Week 3: marketing KPIs and customer segmentation",
      "Week 4: build a portfolio project and publish it on GitHub"
    ]
  }
]

</script>

<style scoped>
.code-container {
  position: relative;
  margin-top: 16px;
}

.copy-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #6c63ff;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: 0.2s ease;
  z-index: 2;
}

.copy-btn:hover {
  background: #574bdb;
}

.code-container pre {
  overflow-x: auto;
  padding: 50px 16px 16px 16px;
  border-radius: 16px;
  background: #172033;
}

.code-container code {
  color: #f7f8ff;
  background: transparent;
}

.dataset-page {
  min-height: 100vh;
  padding: 32px;
  color: #172033;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.hero {
  display: grid;
  place-items: center;
  min-height: 320px;
  padding: 48px 32px;
  border-radius: 32px;
  background: linear-gradient(135deg, #1f3b73, #6c63ff);
  color: white;
  box-shadow: 0 24px 60px rgba(31, 59, 115, 0.25);
}

.hero h1 {
  max-width: 900px;
  margin: 0;
  font-size: clamp(2.4rem, 6vw, 5rem);
  line-height: 1;
  letter-spacing: -0.06em;
}

.hero-text {
  max-width: 720px;
  margin-top: 24px;
  font-size: 1.2rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.86);
}

.eyebrow {
  margin: 0 0 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #6c63ff;
}

.hero .eyebrow {
  color: rgba(255, 255, 255, 0.75);
}

.intro-card,
.skills-card,
.questions-section,
.category-card {
  margin-top: 28px;
  padding: 28px;
  border-radius: 28px;
  background: white;
  box-shadow: 0 16px 40px rgba(23, 32, 51, 0.08);
}

.intro-card h2,
.skills-card h2,
.questions-section h2,
.category-card h2 {
  margin: 0;
  font-size: 1.8rem;
  letter-spacing: -0.03em;
}

.intro-card p,
.category-description {
  max-width: 820px;
  color: #5b6475;
  line-height: 1.7;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  margin-top: 28px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.category-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: #f0efff;
  font-size: 1.5rem;
}

.variable-list {
  display: grid;
  gap: 16px;
  margin-top: 22px;
}

.variable-card {
  padding: 18px;
  border: 1px solid #e7e9f0;
  border-radius: 20px;
  background: #fbfcff;
}

.variable-card h3 {
  margin: 0 0 8px;
  font-size: 1rem;
}

code {
  padding: 3px 7px;
  border-radius: 8px;
  background: #edf0f7;
  color: #1f3b73;
  font-family: 'Fira Code', Consolas, monospace;
}

.variable-card p,
.variable-card li {
  color: #5b6475;
  line-height: 1.6;
}

.variable-card ul {
  padding-left: 20px;
  margin-bottom: 0;
}

blockquote {
  margin: 14px 0 0;
  padding: 12px 16px;
  border-left: 4px solid #6c63ff;
  border-radius: 12px;
  background: #f4f3ff;
  color: #2d3350;
  font-weight: 600;
}

.section-title {
  margin-bottom: 22px;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.question-card {
  padding: 20px;
  border-radius: 20px;
  background: #172033;
  color: white;
}

.question-card h3 {
  margin-top: 0;
}

pre {
  overflow-x: auto;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
}

pre code {
  padding: 0;
  background: transparent;
  color: #f7f8ff;
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.skill-pill {
  padding: 10px 16px;
  border-radius: 999px;
  background: #f0efff;
  color: #3a3299;
  font-weight: 700;
}

@media (max-width: 900px) {
  .dataset-page {
    padding: 18px;
  }

  .section-grid,
  .question-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    min-height: auto;
    padding: 36px 24px;
  }
}

.guide-section {
  margin-top: 28px;
  padding: 28px;
  border-radius: 28px;
  background: white;
  box-shadow: 0 16px 40px rgba(23, 32, 51, 0.08);
}

.guide-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  margin-top: 22px;
}

.guide-card {
  padding: 20px;
  border-radius: 20px;
  background: #fbfcff;
  border: 1px solid #e7e9f0;
}

.guide-card h3 {
  margin-top: 0;
  color: #172033;
}

.guide-card p,
.guide-card li {
  color: #5b6475;
  line-height: 1.6;
}

.guide-card ul {
  padding-left: 20px;
}

.guide-card pre {
  margin-top: 14px;
  overflow-x: auto;
  padding: 16px;
  border-radius: 16px;
  background: #172033;
}

.guide-card pre code {
  padding: 0;
  background: transparent;
  color: #f7f8ff;
}

@media (max-width: 900px) {
  .guide-grid {
    grid-template-columns: 1fr;
  }
}
</style>
