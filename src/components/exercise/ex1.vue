<script>
import html2pdf from "html2pdf.js";

export default {
  methods: {
    downloadPDF() {
      const element = document.getElementById("pdf-content");

      const opt = {
        margin: 0.5,
        filename: "ex1-number-analysis.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      html2pdf().set(opt).from(element).save();
    },
  },
};
</script>

<template>

  <button @click="downloadPDF" class="btn btn_pdf mb-3">
    Download PDF
  </button>
  <div id="pdf-content">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <div class="hero-box mb-5">
            <p class="display-4 fw-bold mb-3">Exercise 1: Number Analysis</p>
            <p class="lead mb-3">
              A simple Python script that reads numbers entered by the user,
              then calculates the mean, maximum, and minimum values.
            </p>
            <p class="mb-0">
              This exercise is useful for learning user input, list conversion,
              basic calculations, and formatted output in Python.
            </p>
          </div>
        </div>
      </div>

      <div class="row g-4 justify-content-center">
        <div class="col-12 col-lg-5">
          <div class="card h-100 shadow-sm section-card">
            <div class="card-body">
              <h2 class="section-title">How to run the code</h2>
              <ol class="steps-list">
                <li>Open the terminal in Visual Studio Code.</li>
                <li>Move to the folder where the file is saved.</li>
                <li>Run the script with:</li>
              </ol>

              <pre class="code-box"><code>python ex1.py</code></pre>

              <p class="mt-3 mb-0">
                Then type numbers separated by spaces, for example:
              </p>

              <pre class="code-box"><code>3 89 24 5 10 35 100</code></pre>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-5">
          <div class="card h-100 shadow-sm section-card">
            <div class="card-body">
              <h2 class="section-title">What the code does</h2>
              <ul class="custom-list">
                <li>asks the user to enter numbers</li>
                <li>splits the input text into separate values</li>
                <li>converts each value into a number</li>
                <li>calculates mean, maximum, and minimum</li>
                <li>prints the results in the terminal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-content-center mt-5">
        <div class="col-12 col-lg-10">
          <div class="card shadow-sm section-card">
            <div class="card-body">
              <h2 class="section-title">Python code</h2>
              <pre class="code-box"><code># Exercise 1: Analyze numbers entered by the user
  
  print("📊 Number Analysis")
  
  # Ask the user to enter numbers separated by spaces
  numbers_input = input("Enter numbers separated by spaces: ")
  
  # Convert the string into a list of numbers
  numbers = [float(n) for n in numbers_input.split()]
  
  # Calculations
  average = sum(numbers) / len(numbers)
  maximum = max(numbers)
  minimum = min(numbers)
  
  # Output
  print("\n--- RESULTS ---")
  print(f"Numbers entered: {numbers}")
  print(f"Mean: {average:.2f}")
  print(f"Maximum: {maximum}")
  print(f"Minimum: {minimum}")</code></pre>
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-content-center mt-5">
        <div class="col-12 col-lg-10">
          <div class="card shadow-sm section-card">
            <div class="card-body">
              <h2 class="section-title">Code explanation</h2>

              <div class="explanation-block">
                <h3>1. Title output</h3>
                <pre class="code-inline"><code>print("📊 Number Analysis")</code></pre>
                <p>
                  This prints a title in the terminal. It helps the user understand
                  what the program is about.
                </p>
              </div>

              <div class="explanation-block">
                <h3>2. User input</h3>
                <pre class="code-inline"><code>numbers_input = input("Enter numbers separated by spaces: ")</code></pre>
                <p>
                  The <code>input()</code> function waits for the user to type
                  something and stores the result as text.
                </p>
                <p>
                  Example input:
                </p>
                <pre class="code-inline"><code>10 20 30</code></pre>
              </div>

              <div class="explanation-block">
                <h3>3. Convert text into numbers</h3>
                <pre class="code-inline"><code>numbers = [float(n) for n in numbers_input.split()]</code></pre>
                <p>
                  This line does two things:
                </p>
                <ul class="custom-list">
                  <li><code>split()</code> separates the text using spaces</li>
                  <li><code>float(n)</code> converts each value into a number</li>
                </ul>
                <p>
                  Example:
                </p>
                <pre class="code-inline"><code>"10 20 30" → ["10", "20", "30"] → [10.0, 20.0, 30.0]</code></pre>
              </div>

              <div class="explanation-block">
                <h3>4. Calculations</h3>
                <pre class="code-inline"><code>average = sum(numbers) / len(numbers)
  maximum = max(numbers)
  minimum = min(numbers)</code></pre>
                <p>
                  These lines calculate:
                </p>
                <ul class="custom-list">
                  <li><code>sum(numbers)</code>: total of all values</li>
                  <li><code>len(numbers)</code>: number of values</li>
                  <li><code>max(numbers)</code>: largest value</li>
                  <li><code>min(numbers)</code>: smallest value</li>
                </ul>
              </div>

              <div class="explanation-block">
                <h3>5. Final output</h3>
                <pre class="code-inline"><code>print("\n--- RESULTS ---")
  print(f"Numbers entered: {numbers}")
  print(f"Mean: {average:.2f}")
  print(f"Maximum: {maximum}")
  print(f"Minimum: {minimum}")</code></pre>
                <p>
                  The program prints the results. The expression
                  <code>{average:.2f}</code> formats the mean to two decimal places.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-content-center mt-5">
        <div class="col-12 col-lg-10">
          <div class="card shadow-sm section-card">
            <div class="card-body">
              <h2 class="section-title">Example output</h2>
              <pre class="code-box"><code>📊 Number Analysis
  Enter numbers separated by spaces: 3 89 24 5 10 35 100
  
  --- RESULTS ---
  Numbers entered: [3.0, 89.0, 24.0, 5.0, 10.0, 35.0, 100.0]
  Mean: 38.00
  Maximum: 100.0
  Minimum: 3.0</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-box {
  background: linear-gradient(135deg, #3e70ce, #953ae9);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid #dbeafe;
  color: #f9fafb;
}

.section-card {
  border: none;
  border-radius: 18px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.code-box,
.code-inline {
  background: #111827;
  color: #f9fafb;
  border-radius: 14px;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.95rem;
}

.code-inline {
  margin: 0.75rem 0;
}

.steps-list li,
.custom-list li {
  margin-bottom: 0.5rem;
}

.explanation-block {
  margin-bottom: 2rem;
}

.explanation-block h3 {
  font-size: 1.15rem;
  margin-bottom: 0.75rem;
  color: #2563eb;
}

.btn_pdf {
  background: #7c3aed;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
}
</style>