import { LoadingOutlined } from "@ant-design/icons";
import classNames from "classnames";

export const PrimaryButton = ({
  image = "",
  title = "",
  className = "",
  titleClassName = "",
  onClick = () => {},
  loading = false,
}) => {
  return (
    <div
      className={classNames(
        "flex items-center justify-center border-[1px] cursor-pointer",
        className
      )}
      onClick={loading ? () => {} : onClick}
    >
      <div className="flex items-center">{image}</div>
      <div
        className={classNames(
          "font-[400] leading-[24px] select-none",
          titleClassName
        )}
      >
        {loading ? (
          <div className="flex items-center py-[5px]">
            <LoadingOutlined />
          </div>
        ) : (
          title
        )}
      </div>
    </div>
  );
};
