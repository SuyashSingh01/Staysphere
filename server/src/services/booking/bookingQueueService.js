// ============================================
// Priority Queue for handling concurrent bookings
// ============================================

class BookingRequest {
  constructor(userId, placeId, checkIn, checkOut, price, timestamp, priority = 0) {
    this.userId = userId;
    this.placeId = placeId;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.price = price;
    this.timestamp = timestamp;
    this.priority = priority; // Higher price = higher priority
  }
}

class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  enqueue(request) {
    this.heap.push(request);
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return root;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      
      // Priority: Higher price first, then earlier timestamp
      if (
        this.heap[index].priority > this.heap[parentIndex].priority ||
        (this.heap[index].priority === this.heap[parentIndex].priority &&
         this.heap[index].timestamp < this.heap[parentIndex].timestamp)
      ) {
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  bubbleDown(index) {
    while (true) {
      let largest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (
        leftChild < this.heap.length &&
        (this.heap[leftChild].priority > this.heap[largest].priority ||
         (this.heap[leftChild].priority === this.heap[largest].priority &&
          this.heap[leftChild].timestamp < this.heap[largest].timestamp))
      ) {
        largest = leftChild;
      }

      if (
        rightChild < this.heap.length &&
        (this.heap[rightChild].priority > this.heap[largest].priority ||
         (this.heap[rightChild].priority === this.heap[largest].priority &&
          this.heap[rightChild].timestamp < this.heap[largest].timestamp))
      ) {
        largest = rightChild;
      }

      if (largest !== index) {
        [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
        index = largest;
      } else {
        break;
      }
    }
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0] || null;
  }
}

// Global queue for each place
const bookingQueues = new Map();

function getOrCreateQueue(placeId) {
  if (!bookingQueues.has(placeId)) {
    bookingQueues.set(placeId, new PriorityQueue());
  }
  return bookingQueues.get(placeId);
}
const BookingRequest=new BookingRequest();
export {BookingRequest, getOrCreateQueue , bookingQueues };
