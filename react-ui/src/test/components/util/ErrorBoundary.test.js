// react imports
import React from "react";
import { shallow } from "enzyme";

// test imports
import ErrorBoundary from "../../../components/util/ErrorBoundary";

test("renders error content correctly", () => {
  const wrapper = shallow(
    <ErrorBoundary>
      <div>test</div>
    </ErrorBoundary>
  );
  const div = wrapper.find("div");

  expect(div.props().children).toEqual("test");
  wrapper.instance().setState({ error: "error", errorInfo: { componentStack: "stack" } });
  expect(wrapper).toMatchSnapshot();
});
