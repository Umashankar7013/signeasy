import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        typeof window !== "undefined" &&
        typeof window?.localStorage === "undefined" && (
          <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
            <div className="text-[16px] font-lexend font-[600] text-center">
              Sorry, something went wrong.
            </div>
            <div className="text-[14px] font-lexend font-[300] text-center">
              Set browser to accept cookies. This page uses cookies for a safer,
              more personal experience. To proceed, change you browser settings
              to allow cookies.
            </div>
          </div>
        )
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
