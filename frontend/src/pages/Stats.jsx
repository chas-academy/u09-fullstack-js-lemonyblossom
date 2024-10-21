import LogChart from '../components/charts/LogChart';
import RangeChart from '../components/charts/RangeChart';
import MoodCounterChart from '../components/charts/MoodCounterChart';

const Stats = () => {
  return (
    <div className="chartContainer flex flex-col justify-evenly items-center p-5 md:p-8 md:mb-3 max-w-screen w-screen md:max-w-[800px] text-white">
      <h1 className="text-center mb-5">Statistics</h1>
      <LogChart />
      <RangeChart />
      <MoodCounterChart />
    </div>
  );
};

export default Stats;
