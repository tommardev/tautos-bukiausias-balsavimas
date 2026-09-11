/**
 * Modern Votes Bar Chart Component (powered by Chart.js & ChartDataLabels)
 * Industry-standard, high-clarity bar chart taking ~half screen space.
 * Built according to Emil Kowalski & Karpathy simplicity standards.
 */

import { escapeHTML, formatVotesLt } from "../utils/dom.js";

let chartInstance = null;

/**
 * Formats contestant name for clean display.
 * e.g., "Petras Gražulis" -> "Petras G."
 * @param {string} fullName 
 * @returns {string}
 */
function formatShortName(fullName) {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
}

/**
 * Renders or updates the modern votes bar chart in #votesChartContainer.
 * @param {Object} state 
 */
export function renderChart(state) {
  const container = document.getElementById("votesChartContainer");
  if (!container) return;

  const contestantsWithVotes = state.contestants.map(c => ({
    ...c,
    voteCount: state.votes[c.id] || 0
  })).sort((a, b) => b.voteCount - a.voteCount);

  const totalVotes = contestantsWithVotes.reduce((sum, c) => sum + c.voteCount, 0);
  const maxVotes = Math.max(...contestantsWithVotes.map(c => c.voteCount), 0);

  const leader = contestantsWithVotes[0];
  const leaderLabel = totalVotes > 0 && leader && leader.voteCount > 0
    ? `Dabartinis lyderis: <strong>${escapeHTML(leader.name)}</strong> (${formatVotesLt(leader.voteCount)})`
    : "Balsavimas atidarytas • Atiduokite savo balsą žemiau";

  // Check if wrapper markup already exists
  let canvas = document.getElementById("votesChartCanvas");
  if (!canvas) {
    container.innerHTML = `
      <div class="chart-meta-bar">
        <div class="chart-summary-info">
          <span class="chart-leader-highlight" id="chartLeaderHighlight">${leaderLabel}</span>
        </div>
        <div class="chart-total-pill">
          Iš viso balsų: <strong id="chartTotalVotes">${totalVotes}</strong>
        </div>
      </div>
      <div class="votes-chart-canvas-container">
        <canvas id="votesChartCanvas" aria-label="Balsavimo rezultatų stulpelinė diagrama" role="img"></canvas>
      </div>
    `;
    canvas = document.getElementById("votesChartCanvas");
  } else {
    // Update text labels
    const leaderEl = document.getElementById("chartLeaderHighlight");
    const totalEl = document.getElementById("chartTotalVotes");
    if (leaderEl) leaderEl.innerHTML = leaderLabel;
    if (totalEl) totalEl.textContent = totalVotes;
  }

  if (!canvas) return;

  if (typeof window.Chart === "undefined") {
    // If Chart.js script is still evaluating, attach load listener to render as soon as ready
    const chartScript = document.querySelector('script[src*="chart.umd.min.js"]');
    if (chartScript && !chartScript.dataset.listenerAttached) {
      chartScript.dataset.listenerAttached = "true";
      chartScript.addEventListener("load", () => {
        renderChart(state);
      }, { once: true });
    }
    return;
  }

  // Labels: emoji + short name
  const labels = contestantsWithVotes.map(c => `${c.avatar} ${formatShortName(c.name)}`);
  const data = contestantsWithVotes.map(c => c.voteCount);

  // Background colors: Gold (#1), Silver (#2), Bronze (#3), Slate (Others)
  const bgColors = contestantsWithVotes.map((c, idx) => {
    if (idx === 0) return '#F59E0B'; // Gold
    if (idx === 1) return '#CBD5E1'; // Silver
    if (idx === 2) return '#F97316'; // Bronze
    return 'rgba(148, 163, 184, 0.45)'; // Slate
  });

  const borderColors = contestantsWithVotes.map((c, idx) => {
    if (idx === 0) return '#D97706';
    if (idx === 1) return '#94A3B8';
    if (idx === 2) return '#EA580C';
    return 'rgba(255, 255, 255, 0.2)';
  });

  const yHeadroom = Math.max(maxVotes + (maxVotes > 10 ? 3 : 2), 4);
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animDuration = prefersReducedMotion ? 0 : 220;

  // If chart already exists, update data smoothly
  if (chartInstance) {
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = data;
    chartInstance.data.datasets[0].backgroundColor = bgColors;
    chartInstance.data.datasets[0].borderColor = borderColors;
    chartInstance.options.scales.y.suggestedMax = yHeadroom;
    chartInstance.options.animation.duration = animDuration;
    chartInstance.update();
    return;
  }

  // Register datalabels plugin if available
  const plugins = [];
  if (typeof window.ChartDataLabels !== "undefined") {
    plugins.push(window.ChartDataLabels);
  }

  const ctx = canvas.getContext("2d");
  chartInstance = new window.Chart(ctx, {
    type: "bar",
    plugins,
    data: {
      labels,
      datasets: [{
        label: "Balsai",
        data,
        backgroundColor: bgColors,
        borderColor: borderColors,
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: contestantsWithVotes.map((c, idx) => {
          if (idx === 0) return '#FBBF24';
          if (idx === 1) return '#E2E8F0';
          if (idx === 2) return '#FB923C';
          return 'rgba(245, 158, 11, 0.7)';
        })
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: animDuration,
        easing: "easeOutQuart"
      },
      layout: {
        padding: {
          top: 24,
          bottom: 4,
          left: 4,
          right: 8
        }
      },
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          display: true,
          align: "top",
          anchor: "end",
          offset: 4,
          color: (ctx) => (ctx.dataIndex === 0 ? "#F59E0B" : "#F8FAFC"),
          font: {
            family: "'Space Grotesk', monospace, sans-serif",
            weight: "700",
            size: 11
          },
          formatter: (val) => (val > 0 ? val : "")
        },
        tooltip: {
          enabled: true,
          backgroundColor: "#12131c",
          borderColor: "#F59E0B",
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          titleColor: "#FFFFFF",
          titleFont: {
            family: "'Outfit', sans-serif",
            size: 13,
            weight: "700"
          },
          bodyColor: "#CBD5E1",
          bodyFont: {
            family: "'Outfit', sans-serif",
            size: 12
          },
          callbacks: {
            title: (items) => {
              const c = contestantsWithVotes[items[0].dataIndex];
              return `${c.avatar} ${c.name}`;
            },
            label: (item) => {
              const c = contestantsWithVotes[item.dataIndex];
              const pct = totalVotes > 0 ? Math.round((c.voteCount / totalVotes) * 100) : 0;
              return [
                `Titulas: ${c.alias}`,
                `Balsai: ${c.voteCount} (${pct}% visų balsų)`,
                `Rikiuotė: #${item.dataIndex + 1} vieta`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: "#CBD5E1",
            font: {
              family: "'Outfit', sans-serif",
              size: 11,
              weight: "600"
            },
            maxRotation: 45,
            minRotation: 0,
            autoSkip: false
          }
        },
        y: {
          beginAtZero: true,
          suggestedMax: yHeadroom,
          grid: {
            color: "rgba(255, 255, 255, 0.07)",
            drawBorder: false
          },
          ticks: {
            color: "#94A3B8",
            font: {
              family: "'Space Grotesk', monospace",
              size: 11
            },
            precision: 0,
            stepSize: maxVotes <= 6 ? 1 : undefined
          }
        }
      }
    }
  });
}
