import LogChart from '../components/charts/LogChart';
import RangeChart from '../components/charts/RangeChart';
import MoodCounterChart from '../components/charts/MoodCounterChart';

const Stats = () => {
  return (
    <div className="chartContainer flex flex-col justify-evenly items-center p-4 h-screen md:p-8 md:mb-3 w-screen max-w-[600px] text-white">
      <h1 className="text-center mb-5">Statistics</h1>
      <LogChart />
      <RangeChart />
      <MoodCounterChart />
    </div>
  );
};

export default Stats;
