import LogChart from './LogChart';
import RangeChart from './RangeChart';

const Stats = () => {
  return (
    <div className="stats-container">
      <h1>Statistics</h1>
      <LogChart /> 
      <RangeChart />
    </div>
  );
};

export default Stats;
