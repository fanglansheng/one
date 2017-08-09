export const createToggle = (toggleType = "") => (state, action) => {
  return action.type == toggleType;
};

export const createCurrentIdWithName = (name = "") => (state = -1, action) => {
  if (action.type == `SET_CURRENT_${name}`) {
    return action.id;
  } else {
    return state;
  }
};
