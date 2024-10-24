import LogChart from '../components/charts/LogChart';
import RangeChart from '../components/charts/RangeChart';
import MoodCounterChart from '../components/charts/MoodCounterChart';

const Stats = () => {
  return (
    <div className="chartContainer flex flex-col justify-evenly w-screen items-center  md:p-8 md:mb-3 md:max-w-[600px] lg:max-w-[800px] max-h-screen text-white">
      <h1 className="text-center text-xl mb-5">Monthly Stats</h1>
      <LogChart />
      <RangeChart />
      <MoodCounterChart />
    </div>
  );
};

export default Stats;
