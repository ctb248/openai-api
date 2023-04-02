import { Loading } from "@nextui-org/react";
import styles from "./Loading.module.scss";

const LoadingScreen = () => {
  return (
    <div className={styles.loadingWrapper}>
      <Loading />
    </div>
  );
};

export default LoadingScreen;
