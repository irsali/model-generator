import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { FormArray, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ServerService, OrgDetailService, AccountService, DropdownService } from "../../../services";
import { ModelMetadataService, Status, @viewModel, BaseResponse, DropdownOptionViewModel } from "../../../models";
import { FormComponent, Alert } from "../../form.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap";

@Component({
    selector: '@model',
    templateUrl: './@model.component.html',
})
export class @classNameComponent extends FormComponent implements OnInit {

    form: FormGroup;
    viewModels: Array<@viewModel>;
    modalRef: BsModalRef;
    deleteModalRef: BsModalRef;
    deleteViewModelId: number;
    @Input() companyId: number;
    
    constructor(private router: Router, private route: ActivatedRoute, private accountService: AccountService, private service: ServerService, private orgService: OrgDetailService, private dropdownService: DropdownService, private metaService: ModelMetadataService, private modalService: BsModalService) {
        super();
        this.viewModels = [];
        this.form = this.metaService.toFormGroup(new @viewModel(), this.metaService.get@viewModel());
    }

    ngOnInit(): void {
        this.submitProcessing = true;
        let params: any = this.route.params;
        debugger;
        this.companyId = params.value.companyId || this.accountService.selectedCompanyId;

        try {
            if (this.companyId) {
                this.service.get@viewModels(this.companyId).subscribe((response) => {
                    console.info(response);
                    if (response && response.Status == Status.Success && response.Data && response.Data.length > 0) {
                        this.viewModels = response.Data;
                        this.submitProcessing = false;
                    }
                    else if (response && response.Status == Status.BadRequest) {
                        this.redirectToStart();
                    }
                    this.submitProcessing = false;
                });
            }
            else {
                this.redirectToStart();
            }

        } catch (e) {
            console.warn(e);

        }

    }

    onSubmit() {
        console.info(this.form.value);
        this.submitProcessing = true;
        this.isFireValidation = true;

        if (this.form.valid) {

            try {
                var isAdd: boolean = this.form.value.Id > 0 ? false : true;
                console.info(this.form.value);
                this.service.save@viewModel(this.form.value).subscribe((response) => {
                    console.info(response);
                    if (response.Status == Status.Success) {
                        this.setAlert(new Alert('@uiName is saved successfully', 'success'));
                        this.form.setValue(response.Data);

                        // Adding data in viewModel only for add case
                        if (isAdd)
                            this.viewModels.push(response.Data);
                        else {
                            this.viewModels.forEach((v, i, arr) => {
                                if (v.Id === response.Data.Id) {
                                    arr[i] = response.Data;
                                }
                            });
                        }
                    }
                    else {
                        this.setAlert(new Alert('@uiName could not be saved. Please try again.', 'danger'));
                    }
                    this.submitProcessing = false;
                });
            } catch (e) {
                this.submitProcessing = false;
                console.log('server is not reachable');
            }

        }
        else {
            this.submitProcessing = false;
        }
    }

    onDeleteConfirmation() {
        this.deleteModalRef.hide();
        if (this.deleteViewModelId) {
            this.viewModels.forEach((v, i, arr) => {
                if (v.Id === this.deleteViewModelId) {
                    this.viewModels.splice(i, 1);
                }
            });

            this.service.delete@viewModel(this.deleteViewModelId).subscribe((response) => {
                console.info(response);
            });
        }
    }

    redirectToStart() {
        this.router.navigate([this.accountService.startPath]);
    }

    openEditModel(id: number, template: TemplateRef<any>) {
        var item = this.viewModels.filter(x => x.Id == id)[0];
        if (item) {
            this.form.setValue(item);
            this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
        }
        else {
            console.log('@uiName not found');
        }
    }

    openAddModel(template: TemplateRef<any>) {
        let model = new @viewModel();
        model.CompanyId = this.companyId;
        this.form.setValue(model);
        this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    }

    openDeleteModel(id: number, template: TemplateRef<any>) {
        this.deleteViewModelId = id;
        this.deleteModalRef = this.modalService.show(template);
    }
}

