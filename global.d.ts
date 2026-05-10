import { Mongoose } from 'mongoose';

declare global {
  // Must use var for global augmentation
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}
