import { defineStore } from 'pinia';
import { ref } from 'vue';

export class GenericStore {
  constructor(name) {
    this.items = ref([]);
    this.filteredItems = ref([]);
    this.loading = ref(false);
    this.name = name;
    this.initialMockFunction = null;
  }

  enableMock(mockFunction) {
    this.initialMockFunction = mockFunction;
  }

  disableMock() {
    this.initialMockFunction = null;
  }

  createStore(controller) {
    const initialMockFunction = this.initialMockFunction;
    return defineStore(this.name, {
      state: () => ({
        items: this.items,
        loading: this.loading,
        useMock: !!initialMockFunction,
        mockFunction: initialMockFunction,
      }),
      actions: {
        async fetch(params = '') {
          this.loading = true;

          if (this.useMock && this.mockFunction) {
            const mockData = await this.mockFunction();
            this.items = mockData;
          } else {
            const data = await controller.getAll(params);
            this.items = data;
          }

          this.loading = false;
        },

        async save(item) {
          this.loading = true;
          await controller.create(item);
          await this.fetch('');
          this.loading = false;
        },

        async saveBulk(items) {
          this.loading = true;
          await controller.createBulk(items);
          await this.fetch('');
          this.loading = false;
        },

        async updateItem(Id, item) {
          this.loading = true;
          await controller.update(Id, item);
          await this.fetch('');
          this.loading = false;
        },

        async updateBulk(items) {
          this.loading = true;
          await controller.updateBulk(items);
          await this.fetch('');
          this.loading = false;
        },

        deleteItemLocally(id) {
          this.items = this.items.filter((item) => item.Id !== id);
        },

        async deleteItem(Id) {
          this.loading = true;
          try {
            this.items = this.items.filter((item) => item.Id !== Id);
            await controller.delete(Id);
            await this.fetch('');
            // eslint-disable-next-line no-unused-vars
          } catch (error) {
            this.loading = false;
          }
        },

        async filter(route) {
          this.loading = true;
          if (!this.useMock || !this.mockFunction) {
            const data = await controller.filter(route);
            this.items = data;
          } else {
            const mockData = await this.mockFunction();
            this.items = mockData;
          }
          this.loading = false;
        }
      },
    })();
  }
}
