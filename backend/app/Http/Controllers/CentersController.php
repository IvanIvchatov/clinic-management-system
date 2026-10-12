<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use App\Models\Center;
use App\Models\Address;
use App\Http\Resources\Center as CenterResource;

class CentersController extends BaseController
{
    public function index()
    {
        $centers = Center::with('address')->get();
        return $this->sendResponse(CenterResource::collection($centers), 'Centers get.');
    }

    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required',
            'phone' => 'required',
        ]);
        if ($validator->fails()) {
            return $this->sendError($validator->errors(), [], 422);
        }

        if (!empty($input['address'])) {
            $input['address_id'] = Address::create($input['address'])->id;
        }
        $input['addition'] = $input['addition'] ?? '';

        $center = Center::create($input);
        return $this->sendResponse(new CenterResource($center->load('address')), 'Center created.');
    }

    public function show(Center $center)
    {
        return $this->sendResponse(new CenterResource($center->load('address')), 'Center fetched.');
    }

    public function update(Request $request, Center $center)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required',
            'phone' => 'required',
        ]);
        if ($validator->fails()) {
            return $this->sendError($validator->errors(), [], 422);
        }

        if (!empty($input['address'])) {
            if ($center->address) {
                $center->address->update($input['address']);
            } else {
                $center->address_id = Address::create($input['address'])->id;
            }
        }

        $center->name = $input['name'];
        $center->phone = $input['phone'];
        $center->addition = $input['addition'] ?? $center->addition;
        $center->save();

        return $this->sendResponse(new CenterResource($center->load('address')), 'Center updated.');
    }

    public function destroy(Center $center)
    {
        $center->delete();
        return $this->sendResponse([], 'Center deleted.');
    }
}
