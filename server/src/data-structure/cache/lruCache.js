class LRUCache {
  constructor(capacity = 100) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = { key: "head", value: null, prev: null, next: null };
    this.tail = { key: "tail", value: null, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  add(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.map.has(key)) return null;
    const node = this.map.get(key);
    this.remove(node);
    this.add(node);
    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const existing = this.map.get(key);
      this.remove(existing);
    }

    const newNode = { key, value, prev: null, next: null };
    this.add(newNode);
    this.map.set(key, newNode);

    if (this.map.size > this.capacity) {
      const lru = this.tail.prev;
      this.remove(lru);
      this.map.delete(lru.key);
    }
  }
}


const memoryCache = new LRUCache(100);

export default memoryCache;
