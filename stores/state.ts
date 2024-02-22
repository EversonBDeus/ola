import { defineStore } from 'pinia';
import { reactive, ref, nextTick } from 'vue';
import type { BasDados } from '@/interfaces/basdados';

interface State {
  bas: BasDados[];
  selectedId: string | null;
  baNumber: number;
  baCentral: string;
  baStatus: string;
  baUF: string;
  month: string;
  update: boolean;
  year: number;
  isInvalid: boolean;
  day: number;
  months: string[];
  dateObj: Date;
  sortOrder: number;
}

export const useDadosStore = defineStore('dados', {
  state: (): State => ({
    bas: reactive<BasDados[]>([]),
    sortOrder: 1,
    selectedId: null,
    baNumber: 0,
    baCentral: "",
    baStatus: "Aberto",
    baUF: "",
    month: "",
    update: false,
    day: 0,
    year: 0,
    isInvalid: false,
    dateObj: new Date(),
    months: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
  }),
  actions: {
    async fetchBas() {
      try {
        const response = await fetch('https://lai335y0ug.execute-api.sa-east-1.amazonaws.com/prod/bas');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.bas = data.map((ba: any) => ({
          baCentral: ba.baCentral,
          baStatus: ba.baStatus,
          baNumber: ba.baNumber,
          baUF: ba.baUF,
          date: ba.baDate,
          id: ba.id,
        }));
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    },
    editBa(selectedBa: BasDados) {
      this.selectedId = selectedBa.id ?? null;
      this.baCentral = selectedBa.baCentral;
      this.baNumber = selectedBa.baNumber;
      this.baStatus = selectedBa.baStatus;
      this.baUF = selectedBa.baUF;
      this.update = true;
    },
    async updateBa(
      id: string | null,
      baCentral: string,
      baNumber:number,
      baStatus: string,
      baDate: string,
      baUF: string
    ) {
      const updateBa = {
        baCentral: baCentral,
        baStatus: baStatus,
        baNumber:baNumber,
        baDate: baDate,
        baUF: baUF,
        id: id,
      };

      try {
        const response = await fetch(`https://lai335y0ug.execute-api.sa-east-1.amazonaws.com/prod/bas/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateBa),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(response);
        await this.fetchBas(); // Fetch the updated data
      } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
      }
    },
    async next() {
      try {
        const dateObj = new Date();
        this.month = this.months[dateObj.getMonth()];
        this.day = dateObj.getDate();
        this.year = dateObj.getFullYear();

        const response = await fetch("https://lai335y0ug.execute-api.sa-east-1.amazonaws.com/prod/bas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            baUF: this.baUF,
            baDate: `${this.month} ${this.day} ${this.year}`,
            baNumber: this.baNumber,
            baStatus: this.baStatus,
            baCentral: this.baCentral,
          }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
      }
    },
    async addBas(
      baCentral: string,
      baStatus: string,
      baNumber: number,
      baUF: string
    ) {
      if (  baCentral !== "" &&
      baStatus !== "" &&
      baUF  !== "" &&
      baCentral!== "" &&
      baNumber.toString() !== "") {

        const { month, dateObj } = this;
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        const novoBa: BasDados = {
          baCentral,
          baStatus,
          date: `${month}, ${day} ${year}`,
          baNumber,
          baUF,
        };
        this.isInvalid = false;
        console.log("erro"+ this.isInvalid)
        this.bas.push(novoBa);
  
        try {
          await this.next(); // Wait for the POST request to complete
          await nextTick(); // Wait for UI to update
          await this.fetchBas(); // Fetch the updated data
          console.log("scan");
        } catch (error) {
          console.error(error);
        }
      } else {
        this.isInvalid = true;
      }
    },
  },
});
