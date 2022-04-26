import useExpiration from "../hooks/useExpiration";

const Duration = props => {
  const { readContracts, auctionContractAddress, localProvider } = props;
  const durationToExpire = useExpiration(
    readContracts,
    auctionContractAddress,
    localProvider,
  );
  const getDays = () => {
    if (durationToExpire.days() > 0) {
      return `${durationToExpire.days()} d`;
    } else {
      return "";
    }
  };
  return (
    <>
      {durationToExpire &&
        durationToExpire.as("seconds") > 0 &&
        `${getDays()} ${durationToExpire.hours()}h ${durationToExpire.minutes()}m ${durationToExpire.seconds()}s`}
      {durationToExpire && durationToExpire.as("seconds") <= 0 && `Expired`}
    </>
  );
};

export default Duration;
