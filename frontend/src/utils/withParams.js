import React from 'react';

const withParams = (Cmp) => (props) => {
  return <Cmp {...props} params={props.match && props.match.params} />;
};

export default withParams;
