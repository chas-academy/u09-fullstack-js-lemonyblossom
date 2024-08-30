import LogChart from '../components/charts/LogChart';
import RangeChart from '../components/charts/RangeChart';
import MoodCounterChart from '../components/charts/MoodCounterChart';
const Stats = () => {
  return (
    <div className="stats-container">
      <h1>Statistics</h1>
      <LogChart /> 
      <RangeChart />
      <MoodCounterChart />
    </div>
  );
};

export default Stats;
