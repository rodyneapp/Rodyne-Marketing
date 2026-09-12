import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  PieController,
  ArcElement,
  Tooltip,
  type ChartOptions,
  type Plugin,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  PieController,
  ArcElement,
  Tooltip,
);

interface Datum {
  label: string;
  value: number;
  color?: string;
}
const font = "'DM Sans Variable', 'DM Sans', sans-serif";
const ink = '#9399a9';
const grid = '#ffffff09';
const tooltip = {
  backgroundColor: '#252936',
  titleColor: '#f4f6fc',
  bodyColor: '#c3cbdd',
  borderColor: '#ffffff16',
  borderWidth: 1,
  padding: 12,
  cornerRadius: 7,
  displayColors: false,
  titleFont: { family: font, size: 13 },
  bodyFont: { family: font, size: 12 },
};

const values: Plugin<'bar'> = {
  id: 'visibleValues',
  afterDatasetsDraw(chart) {
    const horizontal = chart.options.indexAxis === 'y';
    const { ctx } = chart;
    ctx.save();
    ctx.font = `12px ${font}`;
    ctx.fillStyle = '#c3cbdd';
    ctx.textAlign = horizontal ? 'left' : 'center';
    ctx.textBaseline = horizontal ? 'middle' : 'bottom';
    chart.getDatasetMeta(0).data.forEach((bar, index) => {
      ctx.fillText(
        String(chart.data.datasets[0].data[index]),
        bar.x + (horizontal ? 10 : 0),
        bar.y - (horizontal ? 0 : 8),
      );
    });
    ctx.restore();
  },
};

function draw(canvas: HTMLCanvasElement) {
  if (Chart.getChart(canvas)) return;
  const kind = canvas.dataset.analyticsChart;
  const rows: Datum[] = JSON.parse(canvas.dataset.chartValues ?? '[]');
  if (kind === 'activity' || kind === 'categories') {
    const horizontal = kind === 'categories';
    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      indexAxis: horizontal ? 'y' : 'x',
      layout: { padding: { top: 12, right: horizontal ? 32 : 4 } },
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false }, tooltip },
      scales: {
        x: {
          beginAtZero: true,
          suggestedMax: horizontal ? 550 : undefined,
          border: { display: false },
          grid: { color: horizontal ? grid : 'transparent', drawTicks: false },
          ticks: {
            color: ink,
            font: { family: font, size: 12 },
            padding: 12,
            maxRotation: 0,
            autoSkip: true,
            ...(horizontal ? { stepSize: 100 } : {}),
          },
        },
        y: {
          beginAtZero: true,
          suggestedMax: horizontal ? undefined : 260,
          border: { display: false },
          grid: { color: horizontal ? 'transparent' : grid, drawTicks: false },
          ticks: {
            color: ink,
            font: { family: font, size: 12 },
            padding: 10,
            ...(horizontal ? {} : { stepSize: 50 }),
          },
        },
      },
    };
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: rows.map((row) => row.label),
        datasets: [
          {
            label: 'Actions',
            data: rows.map((row) => row.value),
            backgroundColor: horizontal
              ? ['#829ff2', '#8b94d7', '#9590c3', '#727d9e']
              : '#829ff2',
            hoverBackgroundColor: '#b2c5fb',
            borderRadius: 4,
            borderSkipped: false,
            maxBarThickness: horizontal ? 18 : 32,
            categoryPercentage: 0.72,
            barPercentage: 0.8,
          },
        ],
      },
      options,
      plugins: [values],
    });
  } else {
    const doughnut = kind === 'outcomes';
    new Chart(canvas, {
      type: doughnut ? 'doughnut' : 'pie',
      data: {
        labels: rows.map((row) => row.label),
        datasets: [
          {
            data: rows.map((row) => row.value),
            backgroundColor: rows.map((row) => row.color ?? '#829ff2'),
            borderColor: '#13151b',
            borderWidth: doughnut ? 0 : 3,
            spacing: doughnut ? 2 : 0,
            borderRadius: doughnut ? 3 : 5,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        cutout: doughnut ? '78%' : 0,
        layout: { padding: 5 },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltip,
            callbacks: { label: (item) => `${item.label}: ${item.raw}%` },
          },
        },
      },
    });
  }
}

const canvases = document.querySelectorAll<HTMLCanvasElement>(
  '[data-analytics-chart]',
);
// Wait for the actual site font so axis labels and values use its metrics.
void document.fonts.ready.then(() => canvases.forEach(draw));
