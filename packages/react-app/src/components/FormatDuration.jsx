import moment from "moment";

const FormatDuration = ({ secondsRemaining, showSeconds }) => {
  const durationToExpire = moment.duration(secondsRemaining, "seconds");
  const getDays = () => {
    if (durationToExpire.days() > 0) {
      return `${durationToExpire.days()} d`;
    } else {
      return "";
    }
  };
  const getSeconds = () => {
    if(showSeconds=== true){
      return `${durationToExpire.seconds()}s`
    }else {
      return "";
    }
  }
  return (
    <>
      {durationToExpire &&
        durationToExpire.as("seconds") > 0 &&
        `${getDays()} ${durationToExpire.hours()}h ${durationToExpire.minutes()}m ${getSeconds()}`}
      {durationToExpire && durationToExpire.as("seconds") <= 0 && `Expired`}
    </>
  );
};

export default FormatDuration;
