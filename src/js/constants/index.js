/* common */
export const SERVER_URL = '127.0.0.1';
export const SERVER_PORT = 8080;
export const ENABLE_EDGE_COLLISION = true;
export const INITIAL_SNAKE_LENGTH = 50;
export const SNAKE_STEP_LENGTH = 2;
export const SNAKE_TURN_ANGLE = 0.08;
export const SNAKE_MOVE_TIME = 1000 / 60;
export const SNAKE_HEAD_RADIUS = 2;
export const MIN_POINTS_TO_COMPUTE_SELF_COLLISIONS = 10;
export const MIN_FRUIT_REGENERATE_TIMEOUT = 1000;
export const MAX_FRUIT_REGENERATE_TIMEOUT = 5000;
export const MIN_FRUIT_SIZE = 6;
export const MAX_FRUIT_SIZE = 25;
export const FIELD_WIDTH = 600;
export const FIELD_HEIGHT = 600;
export const WINNING_POINTS_TRESHOLD = 1000;

/* server-specific */
export const CONNECTION_ESTABLISHED = 1;
export const GAME_SYNC_TIME = 1000 / 12;
export const PING_SYNC_TIME = 2500;
export const CHAT_SYNC_TIME = 1000 / 8;

/* client-specific */
export const FRUIT_COLOR = '#6acc1c';
export const SNAKE_WIDTH = 1;
